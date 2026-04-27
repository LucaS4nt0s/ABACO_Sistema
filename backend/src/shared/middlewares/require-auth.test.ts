import { describe, expect, it, vi } from 'vitest';

import { HttpError } from './error-handler';
import { requireAuth } from './require-auth';

describe('requireAuth', () => {
  it('rejects requests without a bearer token', () => {
    const next = vi.fn();

    requireAuth({ headers: {} } as any, {} as any, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(HttpError);
    expect((next.mock.calls[0][0] as HttpError).status).toBe(401);
  });
});
