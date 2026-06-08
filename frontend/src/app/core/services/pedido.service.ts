import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Pedido, PedidoCreatePayload, PedidoEntregaPayload, PedidoUpdatePayload } from '../models/pedido.model';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly baseUrl = '/api/v1/pedidos';

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.baseUrl);
  }

  create(payload: PedidoCreatePayload): Observable<Pedido> {
    return this.http.post<Pedido>(this.baseUrl, payload);
  }

  update(pedidoId: number, payload: PedidoUpdatePayload): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.baseUrl}/${pedidoId}`, payload);
  }

  entregar(pedidoId: number, payload: PedidoEntregaPayload): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.baseUrl}/${pedidoId}/entregar`, payload);
  }

  delete(pedidoId: number): Observable<{ detail: string }> {
    return this.http.delete<{ detail: string }>(`${this.baseUrl}/${pedidoId}`);
  }
}
