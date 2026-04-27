import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';

import { getEnv } from '../../config/env';
import type { AuthenticatedUser } from '../../modules/auth/auth.types';
import { HttpError } from './error-handler';

export interface RequestWithUser extends Request {
  user?: AuthenticatedUser;
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    next(new HttpError(401, 'Missing bearer token'));
    return;
  }

  try {
    const token = authorization.slice('Bearer '.length).trim();
    const payload = jwt.verify(token, getEnv().JWT_SECRET) as AuthenticatedUser;

    (req as RequestWithUser).user = payload;
    next();
  } catch {
    next(new HttpError(401, 'Invalid token'));
  }
}
