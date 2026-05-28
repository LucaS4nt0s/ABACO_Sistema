import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

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

export interface LoginResponse {
  token: string;
  role: 'DIRECTOR' | 'ADMIN' | 'TEACHER' | string;
}

interface JwtPayload {
  sub?: string;
  cargo?: number;
  exp?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly loginUrl = 'http://localhost:8000/api/v1/auth/login';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginApiResponse>(this.loginUrl, { email, senha: password }).pipe(
      map((response) => ({
        token: response.access_token,
        role: this.mapCargoToRole(response.usuario.cargo),
      })),
      catchError((error) => {
        const message = error?.error?.detail || error?.message || 'Credenciais inválidas';
        return throwError(() => ({ status: error?.status, message }));
      })
    );
  }

  private mapCargoToRole(cargo: number | null): LoginResponse['role'] {
    if (cargo === 1) {
      return 'DIRECTOR';
    }

    if (cargo === 2) {
      return 'TEACHER';
    }

    if (cargo === 3) {
      return 'ADMIN';
    }

    return 'ADMIN';
  }

  setToken(token: string) {
    localStorage.setItem('abaco_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('abaco_token');
  }

  getRoleFromToken(): LoginResponse['role'] {
    const token = this.getToken();
    if (!token) {
      return 'ADMIN';
    }

    const payload = this.decodePayload(token);
    return this.mapCargoToRole(payload.cargo ?? null);
  }

  hasDirectorAccess(): boolean {
    return this.getRoleFromToken() === 'DIRECTOR';
  }

  private decodePayload(token: string): JwtPayload {
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
}
