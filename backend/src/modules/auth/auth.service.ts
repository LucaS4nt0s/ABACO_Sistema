import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { getEnv } from '../../config/env';
import { HttpError } from '../../shared/middlewares/error-handler';
import { findUserByEmail } from './auth.repository';
import type { AuthenticatedUser, RoleCode, RoleName } from './auth.types';

const roleByCode: Record<RoleCode, RoleName> = {
  0: 'diretora',
  1: 'administrativo',
  2: 'professor',
};

function toAuthenticatedUser(user: Awaited<ReturnType<typeof findUserByEmail>>): AuthenticatedUser {
  if (!user) {
    throw new HttpError(401, 'Invalid credentials');
  }

  return {
    id: user.id,
    nome: user.nome,
    cargo: roleByCode[user.cargo],
  };
}

export async function authenticateUser(email: string, password: string): Promise<string> {
  const user = await findUserByEmail(email);
  const authenticatedUser = toAuthenticatedUser(user);

  if (!user) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.senhaHash);

  if (!isPasswordValid) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const { JWT_SECRET } = getEnv();

  return jwt.sign(authenticatedUser, JWT_SECRET, { expiresIn: '8h' });
}
