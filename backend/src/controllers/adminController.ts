import type { Request, Response } from 'express';
import { query } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const SERVICE_LEADER_THRESHOLDS = {
  bronze: 100,
  silver: 500,
  gold: 1000,
};

const updateStatsForAct = async (userId: string, creditsDelta: number, verified: boolean) => {
  await query(
    `UPDATE user_stats
     SET total_credits = total_credits + $1,
         total_acts_verified = total_acts_verified + $2,
         updated_at = NOW()
     WHERE user_id = $3`,
    [creditsDelta, verified ? 1 : 0, userId]
  );

  const stats = await query('SELECT total_credits FROM user_stats WHERE user_id = $1', [userId]);
  const totalCredits = stats.rows[0]?.total_credits || 0;
  let tier: string | null = null;
  if (totalCredits >= SERVICE_LEADER_THRESHOLDS.gold) tier = 'gold';
  else if (totalCredits >= SERVICE_LEADER_THRESHOLDS.silver) tier = 'silver';
  else if (totalCredits >= SERVICE_LEADER_THRESHOLDS.bronze) tier = 'bronze';

  await query(
    `UPDATE user_stats
     SET service_leader_status = $1,
         service_leader_tier = $2,
         updated_at = NOW()
     WHERE user_id = $3`,
    [tier !== null, tier, userId]
  );
};

export const listPendingActs = asyncHandler(async (_req: Request, res: Response) => {
  const acts = await query(
    `SELECT ka.*, u.username, u.full_name
     FROM kindness_acts ka
     JOIN users u ON ka.user_id = u.id
     WHERE ka.verification_status = 'pending'
     ORDER BY ka.created_at ASC`
  );
  res.json(acts.rows);
});

export const verifyAct = asyncHandler(async (req: Request, res: Response) => {
  const adminId = req.user!.userId;
  const actId = req.params.id;
  const credits = Number(req.body.credits || 1);

  const actResult = await query('SELECT user_id, verification_status FROM kindness_acts WHERE id = $1', [actId]);
  if (actResult.rows.length === 0) {
    return res.status(404).json({ message: 'Act not found' });
  }
  if (actResult.rows[0].verification_status !== 'pending') {
    return res.status(400).json({ message: 'Act already reviewed' });
  }

  await query(
    `UPDATE kindness_acts
     SET verification_status = 'verified',
         verified_at = NOW(),
         verified_by = $1,
         credits_awarded = $2
     WHERE id = $3`,
    [adminId, credits, actId]
  );

  await updateStatsForAct(actResult.rows[0].user_id, credits, true);
  res.json({ message: 'Act verified' });
});

export const rejectAct = asyncHandler(async (req: Request, res: Response) => {
  const adminId = req.user!.userId;
  const actId = req.params.id;
  const { reason } = req.body;

  const actResult = await query('SELECT user_id, verification_status FROM kindness_acts WHERE id = $1', [actId]);
  if (actResult.rows.length === 0) {
    return res.status(404).json({ message: 'Act not found' });
  }
  if (actResult.rows[0].verification_status !== 'pending') {
    return res.status(400).json({ message: 'Act already reviewed' });
  }

  await query(
    `UPDATE kindness_acts
     SET verification_status = 'rejected',
         verified_at = NOW(),
         verified_by = $1,
         rejection_reason = $2
     WHERE id = $3`,
    [adminId, reason, actId]
  );

  res.json({ message: 'Act rejected' });
});

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const search = req.query.search as string | undefined;
  let sql = `SELECT id, email, username, full_name, account_tier, created_at FROM users`;
  const values: unknown[] = [];
  if (search) {
    sql += ` WHERE email ILIKE $1 OR username ILIKE $1`;
    values.push(`%${search}%`);
  }
  sql += ' ORDER BY created_at DESC LIMIT 100';
  const users = await query(sql, values);
  res.json(users.rows);
});

export const getStatsOverview = asyncHandler(async (_req: Request, res: Response) => {
  const [usersCount, actsToday, actsWeek, actsMonth, creditsTotal] = await Promise.all([
    query('SELECT COUNT(*) FROM users'),
    query("SELECT COUNT(*) FROM kindness_acts WHERE verification_status = 'verified' AND act_date = CURRENT_DATE"),
    query("SELECT COUNT(*) FROM kindness_acts WHERE verification_status = 'verified' AND act_date >= CURRENT_DATE - INTERVAL '7 days'"),
    query("SELECT COUNT(*) FROM kindness_acts WHERE verification_status = 'verified' AND act_date >= date_trunc('month', CURRENT_DATE)"),
    query("SELECT COALESCE(SUM(credits_awarded),0) AS total FROM kindness_acts WHERE verification_status = 'verified'"),
  ]);

  const mostActive = await query(
    `SELECT u.username, us.total_acts_verified
     FROM user_stats us
     JOIN users u ON us.user_id = u.id
     ORDER BY us.total_acts_verified DESC
     LIMIT 5`
  );

  res.json({
    totalUsers: Number(usersCount.rows[0].count),
    verifiedToday: Number(actsToday.rows[0].count),
    verifiedWeek: Number(actsWeek.rows[0].count),
    verifiedMonth: Number(actsMonth.rows[0].count),
    creditsDistributed: Number(creditsTotal.rows[0].total || 0),
    mostActive: mostActive.rows,
  });
});
