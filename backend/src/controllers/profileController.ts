import type { Request, Response } from 'express';
import { query } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const username = req.params.username;
  const userResult = await query(
    `SELECT id, username, full_name, avatar_url, bio, created_at
     FROM users WHERE username = $1`,
    [username]
  );

  if (userResult.rows.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  const user = userResult.rows[0];
  const stats = await query('SELECT * FROM user_stats WHERE user_id = $1', [user.id]);
  const acts = await query(
    `SELECT ka.id, ka.title, ka.description, ka.media_url, ka.media_type, ka.act_date, ka.credits_awarded, ka.created_at, u.username
     FROM kindness_acts ka
     JOIN users u ON u.id = ka.user_id
     WHERE ka.user_id = $1 AND ka.visibility != 'private' AND ka.verification_status = 'verified'
     ORDER BY ka.act_date DESC
     LIMIT 20`,
    [user.id]
  );

  res.json({ user, stats: stats.rows[0] || null, acts: acts.rows });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { fullName, bio, avatarUrl } = req.body;

  const result = await query(
    `UPDATE users
     SET full_name = COALESCE($1, full_name),
         bio = COALESCE($2, bio),
         avatar_url = COALESCE($3, avatar_url)
     WHERE id = $4
     RETURNING id, username, full_name, bio, avatar_url`,
    [fullName, bio, avatarUrl, userId]
  );

  res.json(result.rows[0]);
});
