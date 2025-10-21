import type { Request, Response } from 'express';
import { format } from 'date-fns';
import { query } from '../config/db.js';

export const getDashboard = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const [userResult, streakResult, todaysAct] = await Promise.all([
    query('SELECT full_name FROM users WHERE id = $1', [userId]),
    query('SELECT total_credits, total_acts_verified, current_streak, service_leader_status, service_leader_tier FROM user_stats WHERE user_id = $1', [userId]),
    query(
      `SELECT id, verification_status, act_date
       FROM kindness_acts
       WHERE user_id = $1 AND act_date = CURRENT_DATE
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    ),
  ]);

  const communityActs = await query(
    `SELECT ka.id, ka.title, ka.description, ka.media_url, ka.media_type, ka.created_at, u.username, u.avatar_url
     FROM kindness_acts ka
     JOIN users u ON ka.user_id = u.id
     WHERE ka.verification_status = 'verified'
     ORDER BY ka.created_at DESC
     LIMIT 10`
  );

  const leaderboard = await query(
    `SELECT u.username, u.avatar_url, us.total_credits
     FROM user_stats us
     JOIN users u ON u.id = us.user_id
     WHERE us.total_credits > 0
     ORDER BY us.total_credits DESC
     LIMIT 5`
  );

  const streak = streakResult.rows[0];
  const welcomeQuote = getDailyQuote();

  res.json({
    user: {
      name: userResult.rows[0]?.full_name || req.user?.username,
    },
    stats: streak || null,
    todaysAct: todaysAct.rows[0] || null,
    communityFeed: communityActs.rows,
    leaderboard: leaderboard.rows,
    quote: welcomeQuote,
  });
};

const QUOTES = [
  'AI is watching. Set the example.',
  'Your kindness today trains the AI of tomorrow.',
  'Be the humanity you want to see in machines.',
  '15 years of hell or heaven - your choice starts now.',
];

const getDailyQuote = () => {
  const index = Number(format(new Date(), 'd')) % QUOTES.length;
  return QUOTES[index];
};
