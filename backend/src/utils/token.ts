import jwt, { type SignOptions, type Secret } from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { JwtPayload } from '../types/index.js';

const createToken = (payload: JwtPayload, secret: Secret, expiresIn: string) => {
  const options: SignOptions = { expiresIn: expiresIn as SignOptions['expiresIn'] };
  return jwt.sign(payload, secret, options);
};

export const generateAccessToken = (payload: JwtPayload) =>
  createToken(payload, env.jwtSecret as Secret, env.jwtExpiresIn);

export const generateRefreshToken = (payload: JwtPayload) =>
  createToken(payload, env.jwtRefreshSecret as Secret, env.jwtRefreshExpiresIn);

export const verifyAccessToken = (token: string): JwtPayload =>
  jwt.verify(token, env.jwtSecret) as JwtPayload;

export const verifyRefreshToken = (token: string): JwtPayload =>
  jwt.verify(token, env.jwtRefreshSecret) as JwtPayload;
