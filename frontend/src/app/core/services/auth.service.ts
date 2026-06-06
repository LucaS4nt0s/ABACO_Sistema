import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError, tap } from 'rxjs';

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

interface JwtPayload {
  sub?: string;
  cargo?: number;
  exp?: number;
}

interface AuthState {
  token: string | null;
  userId: number | null;
  role: AppRole | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly loginUrl = 'http://localhost:8000/api/v1/auth/login';
  private readonly TOKEN_KEY = 'abaco_token';

  readonly authState = signal<AuthState>({ token: null, userId: null, role: null });

  constructor(private http: HttpClient) {
    this.restoreSession();
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginApiResponse>(this.loginUrl, { email, senha: password }).pipe(
      map((response) => ({
        token: response.access_token,
        role: this.mapCargoToRole(response.usuario.cargo),
      })),
      tap((res) => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        const payload = this.decodePayload(res.token);
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
    localStorage.removeItem(this.TOKEN_KEY);
    this.authState.set({ token: null, userId: null, role: null });
  }

  getToken(): string | null {
    return this.authState().token;
  }

  getRole(): AppRole | null {
    return this.authState().role;
  }

  getUserId(): number | null {
    return this.authState().userId;
  }

  isAuthenticated(): boolean {
    const state = this.authState();
    if (!state.token) return false;
    const payload = this.decodePayload(state.token);
    if (!payload.exp) return false;
    return payload.exp * 1000 > Date.now();
  }

  hasRole(allowedRoles: AppRole[]): boolean {
    const role = this.getRole();
    return role !== null && allowedRoles.includes(role);
  }

  private restoreSession(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return;

    const payload = this.decodePayload(token);
    if (!payload.exp || payload.exp * 1000 <= Date.now()) {
      localStorage.removeItem(this.TOKEN_KEY);
      return;
    }

    this.authState.set({
      token,
      userId: payload.sub ? Number(payload.sub) : null,
      role: this.mapCargoToRole(payload.cargo ?? null),
    });
  }

  private mapCargoToRole(cargo: number | null): AppRole {
    if (cargo === 1) return 'DIRECTOR';
    if (cargo === 2) return 'TEACHER';
    return 'ADMIN';
  }

  private decodePayload(token: string): JwtPayload {
    const parts = token.split('.');
    if (parts.length !== 3) return {};

    try {
      const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
      const decoded = atob(padded);
      return JSON.parse(decoded) as JwtPayload;
    } catch {
      return {};
    }
  }
}
