export type RoleName = 'diretora' | 'administrativo' | 'professor';

export interface AuthenticatedUser {
  id: number;
  nome: string;
  cargo: RoleName;
}

export interface LoginInput {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
}
