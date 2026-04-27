import { pool } from '../../config/database';
import type { RoleCode, StoredUser } from './auth.types';

type UserRow = {
  id: number;
  nome: string;
  email: string;
  senhaHash: string;
  cargo: number;
};

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const result = await pool.query<UserRow>(
    `
      SELECT
        idusuario AS id,
        nome,
        email,
        senhahash AS "senhaHash",
        cargo
      FROM usuario
      WHERE email = $1
      LIMIT 1
    `,
    [email],
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    nome: row.nome,
    email: row.email,
    senhaHash: row.senhaHash,
    cargo: row.cargo as RoleCode,
  };
}
