import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Turma, TurmaCreatePayload, TurmaUpdatePayload } from '../models/turma.model';

@Injectable({ providedIn: 'root' })
export class TurmaService {
  private readonly baseUrl: string;

  constructor(private readonly http: HttpClient) {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const port = typeof window !== 'undefined' ? window.location.port : '';
    if (hostname === 'localhost' && (port === '4200' || port === '5173' || port === '3000')) {
      this.baseUrl = 'http://localhost:8000/api/v1/turmas';
    } else {
      this.baseUrl = '/api/v1/turmas';
    }
  }

  list(): Observable<Turma[]> {
    return this.http.get<Turma[]>(this.baseUrl);
  }

  create(payload: TurmaCreatePayload): Observable<Turma> {
    return this.http.post<Turma>(this.baseUrl, payload);
  }

  update(turmaId: number, payload: TurmaUpdatePayload): Observable<Turma> {
    return this.http.put<Turma>(`${this.baseUrl}/${turmaId}`, payload);
  }

  delete(turmaId: number): Observable<{ detail: string }> {
    return this.http.delete<{ detail: string }>(`${this.baseUrl}/${turmaId}`);
  }
}
