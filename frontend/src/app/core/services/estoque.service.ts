import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Estoque, EstoqueCreatePayload, EstoqueUpdatePayload } from '../models/estoque.model';

@Injectable({ providedIn: 'root' })
export class EstoqueService {
  private readonly baseUrl = '/api/v1/estoque';

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(this.baseUrl);
  }

  search(term: string): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(`${this.baseUrl}/search`, { params: { q: term } });
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
