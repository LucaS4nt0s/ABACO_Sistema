import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import {
  Usuario,
  UsuarioCreatePayload,
  UsuarioUpdatePayload,
} from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  // Use relative API path so nginx proxy in Docker works.
  // When running locally via `ng serve` use localhost:8000 as backend.
  private readonly baseUrl: string;

  constructor(private readonly http: HttpClient) {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const port = typeof window !== 'undefined' ? window.location.port : '';
    // If running with ng serve (commonly port 4200) prefer direct backend on localhost:8000
    if (hostname === 'localhost' && (port === '4200' || port === '5173' || port === '3000')) {
      this.baseUrl = 'http://localhost:8000/api/v1/usuarios';
    } else {
      // In Docker/nginx the frontend is served from same origin; proxy will forward /api to backend
      this.baseUrl = '/api/v1/usuarios';
    }
  }

  list(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl).pipe(map((usuarios) => usuarios.map((usuario) => this.normalize(usuario))));
  }

  create(payload: UsuarioCreatePayload): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, payload).pipe(map((usuario) => this.normalize(usuario)));
  }

  update(usuarioId: number, payload: UsuarioUpdatePayload): Observable<Usuario> {
    return this.http
      .put<Usuario>(`${this.baseUrl}/${usuarioId}`, payload)
      .pipe(map((usuario) => this.normalize(usuario)));
  }

  delete(usuarioId: number): Observable<{ detail: string }> {
    return this.http.delete<{ detail: string }>(`${this.baseUrl}/${usuarioId}`);
  }

  private normalize(usuario: Usuario): Usuario {
    return {
      ...usuario,
      nome: usuario.nome ?? '',
      telefone: usuario.telefone ?? '',
      cargo: usuario.cargo ?? 3,
    };
  }
}
