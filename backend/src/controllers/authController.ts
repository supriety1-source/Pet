import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database';
import { hashPassword, comparePassword, generateTokens, verifyRefreshToken } from '../utils/auth';
import { User } from '../types';

export const signupValidation = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('username')
    .isLength({ min: 3, max: 100 })
    .withMessage('Username must be 3-100 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('full_name').optional().trim(),
];

export const signup = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, username, password, full_name } = req.body;

  try {
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      res.status(409).json({ error: 'Email or username already exists' });
      return;
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Create user
    const result = await pool.query<User>(
      `INSERT INTO users (email, username, password_hash, full_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, username, full_name, avatar_url, bio, is_admin, created_at, account_tier`,
      [email, username, password_hash, full_name || null]
    );

    const user = result.rows[0];

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      username: user.username,
      isAdmin: user.is_admin,
    });

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        bio: user.bio,
        is_admin: user.is_admin,
        account_tier: user.account_tier,
      },
      ...tokens,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
};

export const loginValidation = [
  body('emailOrUsername').notEmpty().withMessage('Email or username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const login = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { emailOrUsername, password } = req.body;

  try {
    // Find user by email or username
    const result = await pool.query<User>(
      'SELECT * FROM users WHERE email = $1 OR username = $1',
      [emailOrUsername]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const user = result.rows[0];

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Update last login
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    // Get user stats
    const statsResult = await pool.query(
      'SELECT * FROM user_stats WHERE user_id = $1',
      [user.id]
    );

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      username: user.username,
      isAdmin: user.is_admin,
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        bio: user.bio,
        is_admin: user.is_admin,
        account_tier: user.account_tier,
      },
      stats: statsResult.rows[0] || null,
      ...tokens,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401).json({ error: 'Refresh token required' });
    return;
  }

  try {
    const payload = verifyRefreshToken(refreshToken);

    // Verify user still exists
    const result = await pool.query<User>(
      'SELECT id, email, username, is_admin FROM users WHERE id = $1',
      [payload.userId]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const user = result.rows[0];

    // Generate new tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      username: user.username,
      isAdmin: user.is_admin,
    });

    res.json(tokens);
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const userResult = await pool.query<User>(
      'SELECT id, email, username, full_name, avatar_url, bio, is_admin, created_at, account_tier FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const statsResult = await pool.query(
      'SELECT * FROM user_stats WHERE user_id = $1',
      [userId]
    );

    res.json({
      user: userResult.rows[0],
      stats: statsResult.rows[0] || null,
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
