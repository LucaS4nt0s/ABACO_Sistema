import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface LoginResponse {
  token: string;
  role: 'DIRECTOR' | 'ADMIN' | 'TEACHER' | string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Mocked login: inspects email to decide role
  login(email: string, password: string): Observable<LoginResponse> {
    if (!email || !password) {
      return throwError(() => ({ status: 400, message: 'E-mail e senha são obrigatórios' }));
    }

    const lower = email.toLowerCase();
    let role: string = 'ADMIN';
    if (lower.includes('director')) role = 'DIRECTOR';
    else if (lower.includes('teacher')) role = 'TEACHER';

    // Create a fake token payload (not a real JWT)
    const payload = btoa(JSON.stringify({ sub: email, role }));
    const token = `fake.${payload}.signature`;

    // Simulate network delay of 1s
    return of({ token, role }).pipe(delay(1000));
  }

  setToken(token: string) {
    localStorage.setItem('abaco_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('abaco_token');
  }
}
