import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Aluno, AlunoCreatePayload, AlunoUpdatePayload } from '../models/aluno.model';

@Injectable({ providedIn: 'root' })
export class AlunoService {
  private readonly baseUrl: string;

  constructor(private readonly http: HttpClient) {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const port = typeof window !== 'undefined' ? window.location.port : '';
    if (hostname === 'localhost' && (port === '4200' || port === '5173' || port === '3000')) {
      this.baseUrl = 'http://localhost:8000/api/v1/alunos';
    } else {
      this.baseUrl = '/api/v1/alunos';
    }
  }

  list(): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(this.baseUrl);
  }

  create(payload: AlunoCreatePayload): Observable<Aluno> {
    return this.http.post<Aluno>(this.baseUrl, payload);
  }

  update(alunoId: number, payload: AlunoUpdatePayload): Observable<Aluno> {
    return this.http.put<Aluno>(`${this.baseUrl}/${alunoId}`, payload);
  }

  delete(alunoId: number): Observable<{ detail: string }> {
    return this.http.delete<{ detail: string }>(`${this.baseUrl}/${alunoId}`);
  }
}
