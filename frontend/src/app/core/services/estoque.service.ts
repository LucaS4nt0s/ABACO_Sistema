import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Estoque, EstoqueCreatePayload, EstoqueUpdatePayload } from '../models/estoque.model';

@Injectable({ providedIn: 'root' })
export class EstoqueService {
  private readonly baseUrl: string;

  constructor(private readonly http: HttpClient) {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const port = typeof window !== 'undefined' ? window.location.port : '';
    if (hostname === 'localhost' && (port === '4200' || port === '5173' || port === '3000')) {
      this.baseUrl = 'http://localhost:8000/api/v1/estoque';
    } else {
      this.baseUrl = '/api/v1/estoque';
    }
  }

  list(): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(this.baseUrl);
  }

  create(payload: EstoqueCreatePayload): Observable<Estoque> {
    return this.http.post<Estoque>(this.baseUrl, payload);
  }

  update(estoqueId: number, payload: EstoqueUpdatePayload): Observable<Estoque> {
    return this.http.put<Estoque>(`${this.baseUrl}/${estoqueId}`, payload);
  }

  delete(estoqueId: number): Observable<{ detail: string }> {
    return this.http.delete<{ detail: string }>(`${this.baseUrl}/${estoqueId}`);
  }
}
