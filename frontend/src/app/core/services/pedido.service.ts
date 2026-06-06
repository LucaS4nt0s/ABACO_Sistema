import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Pedido, PedidoCreatePayload, PedidoUpdatePayload } from '../models/pedido.model';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly baseUrl: string;

  constructor(private readonly http: HttpClient) {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const port = typeof window !== 'undefined' ? window.location.port : '';
    if (hostname === 'localhost' && (port === '4200' || port === '5173' || port === '3000')) {
      this.baseUrl = 'http://localhost:8000/api/v1/pedidos';
    } else {
      this.baseUrl = '/api/v1/pedidos';
    }
  }

  list(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.baseUrl);
  }

  create(payload: PedidoCreatePayload): Observable<Pedido> {
    return this.http.post<Pedido>(this.baseUrl, payload);
  }

  update(pedidoId: number, payload: PedidoUpdatePayload): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.baseUrl}/${pedidoId}`, payload);
  }

  delete(pedidoId: number): Observable<{ detail: string }> {
    return this.http.delete<{ detail: string }>(`${this.baseUrl}/${pedidoId}`);
  }
}
