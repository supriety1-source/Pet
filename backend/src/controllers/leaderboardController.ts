import type { Request, Response } from 'express';
import { query } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const rangeSql = {
  week: "act_date >= CURRENT_DATE - INTERVAL '7 days'",
  month: "act_date >= date_trunc('month', CURRENT_DATE)",
  all: 'true',
};

export const getLeaderboard = asyncHandler(async (req: Request, res: Response) => {
  const range = (req.query.range as 'week' | 'month' | 'all') || 'week';
  const condition = rangeSql[range] || rangeSql.week;

  const leaderboard = await query(
    `WITH scoped_acts AS (
       SELECT user_id, SUM(credits_awarded) AS credits,
              COUNT(*) FILTER (WHERE verification_status = 'verified') AS verified_count
       FROM kindness_acts
       WHERE verification_status = 'verified' AND ${condition}
       GROUP BY user_id
     )
     SELECT u.username, u.full_name, u.avatar_url, us.current_streak, us.service_leader_tier,
            COALESCE(sa.credits, 0) AS credits
     FROM users u
     JOIN user_stats us ON us.user_id = u.id
     LEFT JOIN scoped_acts sa ON sa.user_id = u.id
     ORDER BY credits DESC NULLS LAST
     LIMIT 100`
  );

  res.json(leaderboard.rows);
});
