import type { ErrorRequestHandler } from 'express';

import { errorResponse } from '../utils/api-response';

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof HttpError) {
    res.status(error.status).json(errorResponse(error.message));
    return;
  }

  res.status(500).json(errorResponse('Internal server error'));
};
