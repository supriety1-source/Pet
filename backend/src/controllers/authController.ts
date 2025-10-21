import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { randomUUID } from 'crypto';
import { query } from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token.js';
import type { JwtPayload } from '../types/index.js';

const REFRESH_COOKIE = 'supriety_refresh';

const setRefreshCookie = (res: Response, token: string) => {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const signup = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, username, password, fullName } = req.body;

  const existing = await query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);
  if (existing.rows.length > 0) {
    return res.status(409).json({ message: 'Email or username already in use' });
  }

  const passwordHash = await hashPassword(password);
  const id = randomUUID();
  const result = await query(
    `INSERT INTO users (id, email, username, password_hash, full_name)
     VALUES ($1, $2, $3, $4, $5) RETURNING id, email, username, full_name, account_tier, bio, avatar_url`,
    [id, email, username, passwordHash, fullName]
  );

  await query('INSERT INTO user_stats (user_id) VALUES ($1) ON CONFLICT DO NOTHING', [id]);

  const rawUser = result.rows[0];
  const payload: JwtPayload = { userId: rawUser.id, email: rawUser.email, username: rawUser.username, role: 'user' };
  const user = { ...rawUser, role: payload.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  setRefreshCookie(res, refreshToken);

  res.status(201).json({ user, accessToken });
};

export const login = async (req: Request, res: Response) => {
  const { identifier, password } = req.body;
  const result = await query('SELECT * FROM users WHERE email = $1 OR username = $1', [identifier]);
  if (result.rows.length === 0) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const user = result.rows[0];
  const valid = await comparePassword(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    username: user.username,
    role: user.email === process.env.ADMIN_EMAIL ? 'admin' : 'user',
  };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  setRefreshCookie(res, refreshToken);

  res.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      account_tier: user.account_tier,
      avatar_url: user.avatar_url,
      bio: user.bio,
      role: payload.role,
    },
    accessToken,
  });
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE] || req.body.refreshToken;
  if (!token) {
    return res.status(401).json({ message: 'Refresh token missing' });
  }

  try {
    const payload = verifyRefreshToken(token);
    const newAccess = generateAccessToken(payload);
    const newRefresh = generateRefreshToken(payload);
    setRefreshCookie(res, newRefresh);
    res.json({ accessToken: newAccess });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie(REFRESH_COOKIE);
  res.json({ message: 'Logged out' });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  res.json({ message: 'If that account exists, a reset email has been sent.' });
};
