import type { NextFunction, Request, Response } from 'express';

import { authenticateUser } from './auth.service';
import { HttpError } from '../../shared/middlewares/error-handler';

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email, senha } = req.body as { email?: unknown; senha?: unknown };

    if (typeof email !== 'string' || typeof senha !== 'string') {
      throw new HttpError(400, 'Email and senha are required');
    }

    const token = await authenticateUser(email, senha);
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
}
