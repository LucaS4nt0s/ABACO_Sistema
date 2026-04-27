import { describe, expect, it, vi } from 'vitest';

import { HttpError } from './error-handler';
import { requireRole } from './require-role';

describe('requireRole', () => {
  it('rejects a professor when only diretora is allowed', () => {
    const next = vi.fn();
    const middleware = requireRole(['diretora']);

    middleware(
      {
        user: {
          id: 2,
          nome: 'João',
          cargo: 'professor',
        },
      } as any,
      {} as any,
      next,
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(HttpError);
    expect((next.mock.calls[0][0] as HttpError).status).toBe(403);
  });
});
