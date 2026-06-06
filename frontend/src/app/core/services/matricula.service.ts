import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Matricula, MatriculaCreatePayload, MatriculaUpdatePayload } from '../models/matricula.model';

@Injectable({ providedIn: 'root' })
export class MatriculaService {
  private readonly baseUrl: string;

  constructor(private readonly http: HttpClient) {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const port = typeof window !== 'undefined' ? window.location.port : '';
    if (hostname === 'localhost' && (port === '4200' || port === '5173' || port === '3000')) {
      this.baseUrl = 'http://localhost:8000/api/v1/matriculas';
    } else {
      this.baseUrl = '/api/v1/matriculas';
    }
  }

  list(): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(this.baseUrl);
  }

  create(payload: MatriculaCreatePayload): Observable<Matricula> {
    return this.http.post<Matricula>(this.baseUrl, payload);
  }

  update(matriculaId: number, payload: MatriculaUpdatePayload): Observable<Matricula> {
    return this.http.put<Matricula>(this.baseUrl + '/' + matriculaId, payload);
  }

  delete(matriculaId: number): Observable<{ detail: string }> {
    return this.http.delete<{ detail: string }>(this.baseUrl + '/' + matriculaId);
  }
}