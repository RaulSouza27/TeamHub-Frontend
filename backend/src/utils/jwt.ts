import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JWTPayload } from '../types';

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { userId, role } as JWTPayload,
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
};
