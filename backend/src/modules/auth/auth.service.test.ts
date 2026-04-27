import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./auth.repository', () => ({
  findUserByEmail: vi.fn(),
}));

import { findUserByEmail } from './auth.repository';
import { authenticateUser } from './auth.service';

describe('authenticateUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  it('returns a token for a valid bcrypt password', async () => {
    const senhaHash = await bcrypt.hash('senha-correta', 10);

    vi.mocked(findUserByEmail).mockResolvedValue({
      id: 1,
      nome: 'Maria',
      email: 'maria@exemplo.com',
      senhaHash,
      cargo: 1,
    });

    const token = await authenticateUser('maria@exemplo.com', 'senha-correta');
    const payload = jwt.verify(token, 'test-secret') as {
      id: number;
      nome: string;
      cargo: string;
    };

    expect(payload).toMatchObject({
      id: 1,
      nome: 'Maria',
      cargo: 'administrativo',
    });
  });

  it('throws on invalid credentials', async () => {
    vi.mocked(findUserByEmail).mockResolvedValue(null);

    await expect(authenticateUser('missing@exemplo.com', 'senha')).rejects.toThrow(
      'Invalid credentials',
    );
  });
});
