import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database';
import { KindnessAct } from '../types';

export const createActValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category')
    .isIn(['online', 'offline', 'community'])
    .withMessage('Invalid category'),
  body('act_date').isISO8601().withMessage('Invalid date format'),
  body('location').optional().trim(),
];

export const createAct = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { title, description, category, act_date, location } = req.body;
  const userId = req.user?.userId;
  const mediaUrl = req.file?.path; // Will be set by multer middleware
  const mediaType = req.file?.mimetype.startsWith('video/') ? 'video' : 'image';

  try {
    const result = await pool.query<KindnessAct>(
      `INSERT INTO kindness_acts
       (user_id, title, description, category, media_url, media_type, location, act_date, credits_awarded)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1)
       RETURNING *`,
      [userId, title, description, category, mediaUrl || null, mediaUrl ? mediaType : null, location || null, act_date]
    );

    res.status(201).json({
      message: 'Kindness act submitted for verification',
      act: result.rows[0],
    });
  } catch (error) {
    console.error('Create act error:', error);
    res.status(500).json({ error: 'Server error creating act' });
  }
};

export const getMyActs = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const { status } = req.query;

  try {
    let query = 'SELECT * FROM kindness_acts WHERE user_id = $1';
    const params: any[] = [userId];

    if (status && status !== 'all') {
      query += ' AND verification_status = $2';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query<KindnessAct>(query, params);

    res.json({ acts: result.rows });
  } catch (error) {
    console.error('Get my acts error:', error);
    res.status(500).json({ error: 'Server error fetching acts' });
  }
};

export const getCommunityFeed = async (req: Request, res: Response): Promise<void> => {
  const { filter = 'all', sort = 'recent', limit = 20, offset = 0 } = req.query;

  try {
    let query = `
      SELECT
        ka.*,
        u.username, u.full_name, u.avatar_url,
        us.service_leader_tier,
        COUNT(DISTINCT ar.id) as reaction_count,
        COUNT(DISTINCT ac.id) as comment_count
      FROM kindness_acts ka
      JOIN users u ON ka.user_id = u.id
      LEFT JOIN user_stats us ON u.id = us.user_id
      LEFT JOIN act_reactions ar ON ka.id = ar.act_id
      LEFT JOIN act_comments ac ON ka.id = ac.act_id
      WHERE ka.verification_status = 'verified' AND ka.visibility = 'public'
    `;

    // Apply time filter
    if (filter === 'today') {
      query += ` AND ka.created_at >= CURRENT_DATE`;
    } else if (filter === 'week') {
      query += ` AND ka.created_at >= CURRENT_DATE - INTERVAL '7 days'`;
    }

    query += ' GROUP BY ka.id, u.username, u.full_name, u.avatar_url, us.service_leader_tier';

    // Apply sorting
    if (sort === 'recent') {
      query += ' ORDER BY ka.created_at DESC';
    } else if (sort === 'liked') {
      query += ' ORDER BY reaction_count DESC, ka.created_at DESC';
    } else if (sort === 'commented') {
      query += ' ORDER BY comment_count DESC, ka.created_at DESC';
    }

    query += ' LIMIT $1 OFFSET $2';

    const result = await pool.query(query, [limit, offset]);

    res.json({ acts: result.rows });
  } catch (error) {
    console.error('Get community feed error:', error);
    res.status(500).json({ error: 'Server error fetching feed' });
  }
};

export const getActById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const actResult = await pool.query(
      `SELECT
        ka.*,
        u.username, u.full_name, u.avatar_url,
        us.service_leader_tier
       FROM kindness_acts ka
       JOIN users u ON ka.user_id = u.id
       LEFT JOIN user_stats us ON u.id = us.user_id
       WHERE ka.id = $1`,
      [id]
    );

    if (actResult.rows.length === 0) {
      res.status(404).json({ error: 'Act not found' });
      return;
    }

    // Get reactions
    const reactionsResult = await pool.query(
      `SELECT ar.*, u.username, u.avatar_url
       FROM act_reactions ar
       JOIN users u ON ar.user_id = u.id
       WHERE ar.act_id = $1`,
      [id]
    );

    // Get comments
    const commentsResult = await pool.query(
      `SELECT ac.*, u.username, u.full_name, u.avatar_url
       FROM act_comments ac
       JOIN users u ON ac.user_id = u.id
       WHERE ac.act_id = $1
       ORDER BY ac.created_at DESC`,
      [id]
    );

    res.json({
      act: actResult.rows[0],
      reactions: reactionsResult.rows,
      comments: commentsResult.rows,
    });
  } catch (error) {
    console.error('Get act by ID error:', error);
    res.status(500).json({ error: 'Server error fetching act' });
  }
};

export const reactToAct = async (req: Request, res: Response): Promise<void> => {
  const { actId } = req.params;
  const { reaction_type = 'heart' } = req.body;
  const userId = req.user?.userId;

  try {
    // Check if act exists
    const actCheck = await pool.query(
      'SELECT id FROM kindness_acts WHERE id = $1',
      [actId]
    );

    if (actCheck.rows.length === 0) {
      res.status(404).json({ error: 'Act not found' });
      return;
    }

    // Try to insert reaction (will fail if already exists due to unique constraint)
    const result = await pool.query(
      `INSERT INTO act_reactions (act_id, user_id, reaction_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (act_id, user_id)
       DO UPDATE SET reaction_type = $3
       RETURNING *`,
      [actId, userId, reaction_type]
    );

    res.json({ message: 'Reaction added', reaction: result.rows[0] });
  } catch (error) {
    console.error('React to act error:', error);
    res.status(500).json({ error: 'Server error adding reaction' });
  }
};

export const unreactToAct = async (req: Request, res: Response): Promise<void> => {
  const { actId } = req.params;
  const userId = req.user?.userId;

  try {
    await pool.query(
      'DELETE FROM act_reactions WHERE act_id = $1 AND user_id = $2',
      [actId, userId]
    );

    res.json({ message: 'Reaction removed' });
  } catch (error) {
    console.error('Unreact to act error:', error);
    res.status(500).json({ error: 'Server error removing reaction' });
  }
};

export const commentOnAct = async (req: Request, res: Response): Promise<void> => {
  const { actId } = req.params;
  const { comment_text } = req.body;
  const userId = req.user?.userId;

  if (!comment_text || comment_text.trim().length === 0) {
    res.status(400).json({ error: 'Comment text is required' });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO act_comments (act_id, user_id, comment_text)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [actId, userId, comment_text.trim()]
    );

    // Get user info for the response
    const userResult = await pool.query(
      'SELECT username, full_name, avatar_url FROM users WHERE id = $1',
      [userId]
    );

    res.status(201).json({
      message: 'Comment added',
      comment: {
        ...result.rows[0],
        ...userResult.rows[0],
      },
    });
  } catch (error) {
    console.error('Comment on act error:', error);
    res.status(500).json({ error: 'Server error adding comment' });
  }
};
