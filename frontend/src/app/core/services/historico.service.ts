import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Historico } from '../models/historico.model';

@Injectable({ providedIn: 'root' })
export class HistoricoService {
  private readonly baseUrl: string;

  constructor(private readonly http: HttpClient) {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const port = typeof window !== 'undefined' ? window.location.port : '';
    if (hostname === 'localhost' && (port === '4200' || port === '5173' || port === '3000')) {
      this.baseUrl = 'http://localhost:8000/api/v1/historico';
    } else {
      this.baseUrl = '/api/v1/historico';
    }
  }

  getByMatricula(matriculaId: number): Observable<Historico> {
    return this.http.get<Historico>(`${this.baseUrl}/matricula/${matriculaId}`);
  }
}
