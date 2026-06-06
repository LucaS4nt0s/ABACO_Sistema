import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

interface LoginApiResponse {
  access_token: string;
  token_type: string;
  usuario: {
    idUsuario: number;
    nome: string | null;
    email: string;
    cargo: number | null;
  };
}

export type AppRole = 'DIRECTOR' | 'ADMIN' | 'TEACHER';

export interface LoginResponse {
  token: string;
  role: AppRole;
}

export interface JwtPayload {
  sub?: string;
  cargo?: number;
  exp?: number;
}

export function decodePayload(token: string): JwtPayload {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return {};
  }

  try {
    const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const decoded = atob(padded);
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return {};
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodePayload(token);
  if (!payload.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

export function getStoredToken(): string | null {
  return localStorage.getItem('abaco_token');
}

export function clearStoredToken(): void {
  localStorage.removeItem('abaco_token');
}

export function mapCargoToRole(cargo: number | null): LoginResponse['role'] {
  if (cargo === 1) return 'DIRECTOR';
  if (cargo === 2) return 'TEACHER';
  if (cargo === 3) return 'ADMIN';
  return 'ADMIN';
}

interface AuthState {
  token: string | null;
  userId: number | null;
  role: AppRole | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly loginUrl = `${environment.apiUrl}/api/v1/auth/login`;
  private readonly TOKEN_KEY = 'abaco_token';

  readonly authState = signal<AuthState>({ token: null, userId: null, role: null });

  constructor(private http: HttpClient) {
    this.restoreSession();
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginApiResponse>(this.loginUrl, { email, senha: password }).pipe(
      map((response) => ({
        token: response.access_token,
        role: mapCargoToRole(response.usuario.cargo),
      })),
      tap((res) => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        const payload = decodePayload(res.token);
        this.authState.set({
          token: res.token,
          userId: payload.sub ? Number(payload.sub) : null,
          role: res.role,
        });
      }),
      catchError((error) => {
        const message = error?.error?.detail || error?.message || 'Credenciais inválidas';
        return throwError(() => ({ status: error?.status, message }));
      })
    );
  }

  logout(): void {
    clearStoredToken();
    this.authState.set({ token: null, userId: null, role: null });
  }

  isAuthenticated(): boolean {
    const token = getStoredToken();
    if (!token) return false;
    return !isTokenExpired(token);
  }

  hasRole(allowedRoles: AppRole[]): boolean {
    const role = this.getRoleFromToken();
    return allowedRoles.includes(role);
  }

  getUserId(): number | null {
    return this.authState().userId;
  }

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return getStoredToken();
  }

  getRoleFromToken(): LoginResponse['role'] {
    const token = this.getToken();
    if (!token) return 'ADMIN';

    const payload = decodePayload(token);
    return mapCargoToRole(payload.cargo ?? null);
  }

  private restoreSession(): void {
    const token = getStoredToken();
    if (!token) return;

    if (isTokenExpired(token)) {
      clearStoredToken();
      return;
    }

    const payload = decodePayload(token);
    this.authState.set({
      token,
      userId: payload.sub ? Number(payload.sub) : null,
      role: mapCargoToRole(payload.cargo ?? null),
    });
  }
}
