import type { Request, Response } from 'express';
import { query } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getCommunityFeed = asyncHandler(async (req: Request, res: Response) => {
  const filter = req.query.filter as string | undefined;
  const sort = (req.query.sort as string | undefined) || 'recent';

  const filters: string[] = ["ka.verification_status = 'verified'"];
  const values: unknown[] = [];

  if (filter === 'today') {
    filters.push('ka.act_date = CURRENT_DATE');
  } else if (filter === 'week') {
    filters.push("ka.act_date >= CURRENT_DATE - INTERVAL '7 days'");
  }

  let orderBy = 'ka.created_at DESC';
  if (sort === 'likes') {
    orderBy = 'reactions_count DESC NULLS LAST';
  } else if (sort === 'comments') {
    orderBy = 'comments_count DESC NULLS LAST';
  }

  const feed = await query(
    `SELECT ka.*, u.username, u.avatar_url,
            COALESCE(reactions.count, 0) AS reactions_count,
            COALESCE(comments.count, 0) AS comments_count
     FROM kindness_acts ka
     JOIN users u ON u.id = ka.user_id
     LEFT JOIN (
       SELECT act_id, COUNT(*) AS count FROM act_reactions GROUP BY act_id
     ) reactions ON reactions.act_id = ka.id
     LEFT JOIN (
       SELECT act_id, COUNT(*) AS count FROM act_comments GROUP BY act_id
     ) comments ON comments.act_id = ka.id
     WHERE ${filters.join(' AND ')}
     ORDER BY ${orderBy}
     LIMIT 100`,
    values
  );

  res.json(feed.rows);
});
