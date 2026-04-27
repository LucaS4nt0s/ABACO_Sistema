import { apiRequest } from './api';
import type { LoginInput, LoginResponse } from '../types/user';

export async function login(credentials: LoginInput): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}
