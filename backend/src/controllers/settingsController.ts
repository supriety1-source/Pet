import type { Request, Response } from 'express';
import { query } from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const updateAccount = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { email, currentPassword, newPassword } = req.body;

  if (!email && !newPassword) {
    return res.status(400).json({ message: 'Nothing to update' });
  }

  if (email) {
    await query('UPDATE users SET email = $1 WHERE id = $2', [email, userId]);
  }

  if (newPassword) {
    if (!currentPassword) {
      return res.status(400).json({ message: 'Current password required' });
    }
    const user = await query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    const hashRow = user.rows[0];
    if (!hashRow) {
      return res.status(404).json({ message: 'User not found' });
    }
    const valid = await comparePassword(currentPassword, hashRow.password_hash);
    if (!valid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    const hash = await hashPassword(newPassword);
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, userId]);
  }

  res.json({ message: 'Account updated' });
});

export const updatePreferences = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { emailLikes, emailComments, emailSummary, profileVisibility, hideFromFeed } = req.body;

  await query(
    `INSERT INTO user_preferences (user_id, email_likes, email_comments, email_summary, profile_visibility, hide_from_feed)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (user_id) DO UPDATE SET
       email_likes = EXCLUDED.email_likes,
       email_comments = EXCLUDED.email_comments,
       email_summary = EXCLUDED.email_summary,
       profile_visibility = EXCLUDED.profile_visibility,
       hide_from_feed = EXCLUDED.hide_from_feed,
       updated_at = NOW()`,
    [userId, emailLikes, emailComments, emailSummary, profileVisibility, hideFromFeed]
  );

  res.json({ message: 'Preferences updated' });
});

export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  await query('DELETE FROM users WHERE id = $1', [userId]);
  res.json({ message: 'Account deleted' });
});
