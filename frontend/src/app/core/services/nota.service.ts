import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Nota, NotaBatchPayload } from '../models/nota.model';

@Injectable({ providedIn: 'root' })
export class NotaService {
  private readonly baseUrl: string;

  constructor(private readonly http: HttpClient) {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const port = typeof window !== 'undefined' ? window.location.port : '';
    if (hostname === 'localhost' && (port === '4200' || port === '5173' || port === '3000')) {
      this.baseUrl = 'http://localhost:8000/api/v1/notas';
    } else {
      this.baseUrl = '/api/v1/notas';
    }
  }

  listByTurma(turmaId: number, prova?: number): Observable<Nota[]> {
    let params = new HttpParams();
    if (prova !== undefined) {
      params = params.set('prova', prova);
    }
    return this.http.get<Nota[]>(`${this.baseUrl}/turma/${turmaId}`, { params });
  }

  create(payload: NotaBatchPayload): Observable<Nota[]> {
    return this.http.post<Nota[]>(this.baseUrl, payload);
  }
}
