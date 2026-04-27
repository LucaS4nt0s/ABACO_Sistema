import type { NextFunction, Request, Response } from 'express';

import type { RoleName } from '../../modules/auth/auth.types';
import { HttpError } from './error-handler';
import type { RequestWithUser } from './require-auth';

export function requireRole(allowedRoles: RoleName[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = (req as RequestWithUser).user;

    if (!user) {
      next(new HttpError(401, 'Missing authenticated user'));
      return;
    }

    if (!allowedRoles.includes(user.cargo)) {
      next(new HttpError(403, 'Forbidden'));
      return;
    }

    next();
  };
}
