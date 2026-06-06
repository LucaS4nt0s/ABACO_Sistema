import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Curso, CursoCreatePayload, CursoUpdatePayload } from '../models/curso.model';

@Injectable({ providedIn: 'root' })
export class CursoService {
  private readonly baseUrl: string;

  constructor(private readonly http: HttpClient) {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const port = typeof window !== 'undefined' ? window.location.port : '';
    if (hostname === 'localhost' && (port === '4200' || port === '5173' || port === '3000')) {
      this.baseUrl = 'http://localhost:8000/api/v1/cursos';
    } else {
      this.baseUrl = '/api/v1/cursos';
    }
  }

  list(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.baseUrl);
  }

  create(payload: CursoCreatePayload): Observable<Curso> {
    return this.http.post<Curso>(this.baseUrl, payload);
  }

  update(cursoId: number, payload: CursoUpdatePayload): Observable<Curso> {
    return this.http.put<Curso>(`${this.baseUrl}/${cursoId}`, payload);
  }

  delete(cursoId: number): Observable<{ detail: string }> {
    return this.http.delete<{ detail: string }>(`${this.baseUrl}/${cursoId}`);
  }
}
