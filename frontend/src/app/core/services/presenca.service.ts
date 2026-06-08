import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Presenca, PresencaBatchPayload } from '../models/presenca.model';

@Injectable({ providedIn: 'root' })
export class PresencaService {
  private readonly baseUrl: string;

  constructor(private readonly http: HttpClient) {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const port = typeof window !== 'undefined' ? window.location.port : '';
    if (hostname === 'localhost' && (port === '4200' || port === '5173' || port === '3000')) {
      this.baseUrl = 'http://localhost:8000/api/v1/presencas';
    } else {
      this.baseUrl = '/api/v1/presencas';
    }
  }

  listByTurma(turmaId: number, dataAula?: string): Observable<Presenca[]> {
    let params = new HttpParams();
    if (dataAula) {
      params = params.set('dataAula', dataAula);
    }
    return this.http.get<Presenca[]>(`${this.baseUrl}/turma/${turmaId}`, { params });
  }

  create(payload: PresencaBatchPayload): Observable<Presenca[]> {
    return this.http.post<Presenca[]>(this.baseUrl, payload);
  }
}
