import { Request, Response } from 'express';
import pool from '../config/database';

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;

  try {
    const userResult = await pool.query(
      `SELECT
        u.id, u.username, u.full_name, u.avatar_url, u.bio, u.created_at, u.account_tier
       FROM users u
       WHERE u.username = $1`,
      [username]
    );

    if (userResult.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = userResult.rows[0];

    // Get user stats
    const statsResult = await pool.query(
      'SELECT * FROM user_stats WHERE user_id = $1',
      [user.id]
    );

    // Get user's verified acts
    const actsResult = await pool.query(
      `SELECT * FROM kindness_acts
       WHERE user_id = $1 AND verification_status = 'verified' AND visibility = 'public'
       ORDER BY created_at DESC
       LIMIT 20`,
      [user.id]
    );

    res.json({
      user,
      stats: statsResult.rows[0] || null,
      acts: actsResult.rows,
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  const { period = 'all', limit = 100 } = req.query;

  try {
    let query = `
      SELECT
        u.id, u.username, u.full_name, u.avatar_url,
        us.total_credits, us.total_acts_verified,
        us.current_streak, us.service_leader_tier
      FROM user_stats us
      JOIN users u ON us.user_id = u.id
    `;

    // For time-based periods, we need to recalculate credits
    if (period === 'week' || period === 'month') {
      const interval = period === 'week' ? '7 days' : '30 days';
      query = `
        SELECT
          u.id, u.username, u.full_name, u.avatar_url,
          COALESCE(SUM(ka.credits_awarded), 0) as total_credits,
          COUNT(ka.id) as total_acts_verified,
          us.current_streak, us.service_leader_tier
        FROM users u
        LEFT JOIN kindness_acts ka ON u.id = ka.user_id
          AND ka.verification_status = 'verified'
          AND ka.verified_at >= CURRENT_DATE - INTERVAL '${interval}'
        LEFT JOIN user_stats us ON u.id = us.user_id
        GROUP BY u.id, u.username, u.full_name, u.avatar_url, us.current_streak, us.service_leader_tier
      `;
    }

    query += ` ORDER BY total_credits DESC, total_acts_verified DESC LIMIT $1`;

    const result = await pool.query(query, [limit]);

    res.json({ leaderboard: result.rows });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Server error fetching leaderboard' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const { full_name, bio } = req.body;
  const avatar_url = req.file?.path; // Set by multer if file uploaded

  try {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (full_name !== undefined) {
      updates.push(`full_name = $${paramCount}`);
      values.push(full_name);
      paramCount++;
    }

    if (bio !== undefined) {
      updates.push(`bio = $${paramCount}`);
      values.push(bio);
      paramCount++;
    }

    if (avatar_url) {
      updates.push(`avatar_url = $${paramCount}`);
      values.push(avatar_url);
      paramCount++;
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    values.push(userId);

    const result = await pool.query(
      `UPDATE users
       SET ${updates.join(', ')}
       WHERE id = $${paramCount}
       RETURNING id, email, username, full_name, avatar_url, bio, account_tier`,
      values
    );

    res.json({
      message: 'Profile updated successfully',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
};
