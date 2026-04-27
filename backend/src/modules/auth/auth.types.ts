export type RoleName = 'diretora' | 'administrativo' | 'professor';

export type RoleCode = 0 | 1 | 2;

export interface StoredUser {
  id: number;
  nome: string;
  email: string;
  senhaHash: string;
  cargo: RoleCode;
}

export interface AuthenticatedUser {
  id: number;
  nome: string;
  cargo: RoleName;
}
