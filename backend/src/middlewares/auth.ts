import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { verifyToken } from '../utils/jwt';

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      return res.status(401).json({ error: 'Formato de token inválido' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ error: 'Token mal formatado' });
    }

    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    req.userRole = decoded.role;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export const roleMiddleware = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    return next();
  };
};
