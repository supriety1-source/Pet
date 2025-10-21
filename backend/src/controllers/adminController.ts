import { Request, Response } from 'express';
import pool from '../config/database';

export const getPendingActs = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT
        ka.*,
        u.username, u.full_name, u.avatar_url, u.email
       FROM kindness_acts ka
       JOIN users u ON ka.user_id = u.id
       WHERE ka.verification_status = 'pending'
       ORDER BY ka.created_at ASC`
    );

    res.json({ acts: result.rows });
  } catch (error) {
    console.error('Get pending acts error:', error);
    res.status(500).json({ error: 'Server error fetching pending acts' });
  }
};

export const verifyAct = async (req: Request, res: Response): Promise<void> => {
  const { actId } = req.params;
  const adminId = req.user?.userId;

  try {
    const result = await pool.query(
      `UPDATE kindness_acts
       SET
         verification_status = 'verified',
         verified_at = NOW(),
         verified_by = $1
       WHERE id = $2
       RETURNING *`,
      [adminId, actId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Act not found' });
      return;
    }

    res.json({
      message: 'Act verified successfully',
      act: result.rows[0],
    });
  } catch (error) {
    console.error('Verify act error:', error);
    res.status(500).json({ error: 'Server error verifying act' });
  }
};

export const rejectAct = async (req: Request, res: Response): Promise<void> => {
  const { actId } = req.params;
  const { rejection_reason } = req.body;
  const adminId = req.user?.userId;

  if (!rejection_reason) {
    res.status(400).json({ error: 'Rejection reason is required' });
    return;
  }

  try {
    const result = await pool.query(
      `UPDATE kindness_acts
       SET
         verification_status = 'rejected',
         verified_at = NOW(),
         verified_by = $1,
         rejection_reason = $2
       WHERE id = $3
       RETURNING *`,
      [adminId, rejection_reason, actId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Act not found' });
      return;
    }

    res.json({
      message: 'Act rejected',
      act: result.rows[0],
    });
  } catch (error) {
    console.error('Reject act error:', error);
    res.status(500).json({ error: 'Server error rejecting act' });
  }
};

export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsersResult = await pool.query('SELECT COUNT(*) FROM users');
    const pendingActsResult = await pool.query(
      "SELECT COUNT(*) FROM kindness_acts WHERE verification_status = 'pending'"
    );
    const verifiedTodayResult = await pool.query(
      "SELECT COUNT(*) FROM kindness_acts WHERE verification_status = 'verified' AND verified_at >= CURRENT_DATE"
    );
    const totalCreditsResult = await pool.query(
      'SELECT SUM(total_credits) FROM user_stats'
    );
    const mostActiveResult = await pool.query(
      `SELECT u.username, us.total_acts_verified
       FROM user_stats us
       JOIN users u ON us.user_id = u.id
       ORDER BY us.total_acts_verified DESC
       LIMIT 10`
    );

    res.json({
      total_users: parseInt(totalUsersResult.rows[0].count),
      pending_acts: parseInt(pendingActsResult.rows[0].count),
      verified_today: parseInt(verifiedTodayResult.rows[0].count),
      total_credits_distributed: parseInt(totalCreditsResult.rows[0].sum || 0),
      most_active_users: mostActiveResult.rows,
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Server error fetching stats' });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  const { limit = 50, offset = 0 } = req.query;

  try {
    const result = await pool.query(
      `SELECT
        u.id, u.email, u.username, u.full_name, u.avatar_url,
        u.created_at, u.last_login, u.account_tier,
        us.total_credits, us.total_acts_verified, us.service_leader_tier
       FROM users u
       LEFT JOIN user_stats us ON u.id = us.user_id
       ORDER BY u.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json({ users: result.rows });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Server error fetching users' });
  }
};
