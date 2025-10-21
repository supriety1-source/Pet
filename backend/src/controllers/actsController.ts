import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { query } from '../config/db.js';
import { uploadMedia } from '../services/uploadService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const MAX_DAYS_BACK = 7;

export const listActs = asyncHandler(async (req: Request, res: Response) => {
  const status = req.query.status as string | undefined;
  const visibility = req.query.visibility as string | undefined;
  const userId = req.user?.userId;

  const filters: string[] = [];
  const values: unknown[] = [];
  let index = 1;

  if (status) {
    filters.push(`verification_status = $${index++}`);
    values.push(status);
  }
  if (visibility) {
    filters.push(`visibility = $${index++}`);
    values.push(visibility);
  }
  if (req.query.mine === 'true' && userId) {
    filters.push(`user_id = $${index++}`);
    values.push(userId);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  const acts = await query(
    `SELECT ka.*, u.username, u.avatar_url
     FROM kindness_acts ka
     JOIN users u ON ka.user_id = u.id
     ${whereClause}
     ORDER BY ka.created_at DESC
     LIMIT 100`,
    values
  );

  res.json(acts.rows);
});

export const getAct = asyncHandler(async (req: Request, res: Response) => {
  const actId = req.params.id;
  const act = await query(
    `SELECT ka.*, u.username, u.avatar_url
     FROM kindness_acts ka
     JOIN users u ON ka.user_id = u.id
     WHERE ka.id = $1`,
    [actId]
  );

  if (act.rows.length === 0) {
    return res.status(404).json({ message: 'Act not found' });
  }

  res.json(act.rows[0]);
});

export const createAct = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { title, description, category, location, actDate, visibility = 'public' } = req.body;

  if (!title || !description || !category || !actDate) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const actDateObj = new Date(actDate);
  const diff = (Date.now() - actDateObj.getTime()) / (1000 * 60 * 60 * 24);
  if (diff > MAX_DAYS_BACK) {
    return res.status(400).json({ message: 'Acts must be logged within 7 days' });
  }

  const media = await uploadMedia(req.file);

  const id = randomUUID();
  const result = await query(
    `INSERT INTO kindness_acts (id, user_id, title, description, category, media_url, media_type, location, act_date, visibility)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [id, userId, title, description, category, media.url, media.type, location, actDate, visibility]
  );

  res.status(201).json(result.rows[0]);
});

export const updateAct = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const actId = req.params.id;
  const { title, description, category, visibility, location } = req.body;

  const act = await query('SELECT user_id, verification_status FROM kindness_acts WHERE id = $1', [actId]);
  if (act.rows.length === 0) {
    return res.status(404).json({ message: 'Act not found' });
  }
  if (act.rows[0].user_id !== userId) {
    return res.status(403).json({ message: 'You can only edit your acts' });
  }
  if (act.rows[0].verification_status !== 'pending') {
    return res.status(400).json({ message: 'Only pending acts can be edited' });
  }

  const media = await uploadMedia(req.file);

  const fields: string[] = [];
  const values: unknown[] = [];
  let index = 1;

  if (title) {
    fields.push(`title = $${index++}`);
    values.push(title);
  }
  if (description) {
    fields.push(`description = $${index++}`);
    values.push(description);
  }
  if (category) {
    fields.push(`category = $${index++}`);
    values.push(category);
  }
  if (visibility) {
    fields.push(`visibility = $${index++}`);
    values.push(visibility);
  }
  if (location) {
    fields.push(`location = $${index++}`);
    values.push(location);
  }
  if (media.url) {
    fields.push(`media_url = $${index++}`);
    values.push(media.url);
    fields.push(`media_type = $${index++}`);
    values.push(media.type);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: 'No fields provided for update' });
  }

  values.push(actId);

  const result = await query(
    `UPDATE kindness_acts SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`,
    values
  );

  res.json(result.rows[0]);
});

export const deleteAct = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const actId = req.params.id;
  const act = await query('SELECT user_id, verification_status FROM kindness_acts WHERE id = $1', [actId]);
  if (act.rows.length === 0) {
    return res.status(404).json({ message: 'Act not found' });
  }
  if (act.rows[0].user_id !== userId) {
    return res.status(403).json({ message: 'You can only delete your acts' });
  }
  if (act.rows[0].verification_status !== 'pending') {
    return res.status(400).json({ message: 'Only pending acts can be deleted' });
  }

  await query('DELETE FROM kindness_acts WHERE id = $1', [actId]);
  res.json({ message: 'Act deleted' });
});

export const reactToAct = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const actId = req.params.id;
  const { reactionType = 'heart' } = req.body;

  const existing = await query('SELECT id FROM act_reactions WHERE act_id = $1 AND user_id = $2', [actId, userId]);
  if (existing.rows.length > 0) {
    await query('DELETE FROM act_reactions WHERE act_id = $1 AND user_id = $2', [actId, userId]);
    return res.json({ message: 'Reaction removed' });
  }

  await query(
    'INSERT INTO act_reactions (id, act_id, user_id, reaction_type) VALUES ($1, $2, $3, $4)',
    [randomUUID(), actId, userId, reactionType]
  );
  res.json({ message: 'Reaction added' });
});

export const commentOnAct = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const actId = req.params.id;
  const { comment } = req.body;
  if (!comment) {
    return res.status(400).json({ message: 'Comment is required' });
  }

  const result = await query(
    `INSERT INTO act_comments (id, act_id, user_id, comment_text)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [randomUUID(), actId, userId, comment]
  );

  res.status(201).json(result.rows[0]);
});

export const listComments = asyncHandler(async (req: Request, res: Response) => {
  const actId = req.params.id;
  const comments = await query(
    `SELECT ac.*, u.username, u.avatar_url
     FROM act_comments ac
     JOIN users u ON ac.user_id = u.id
     WHERE ac.act_id = $1
     ORDER BY ac.created_at ASC`,
    [actId]
  );

  res.json(comments.rows);
});
