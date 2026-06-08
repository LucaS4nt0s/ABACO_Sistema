import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Pedido, getPedidoStatusLabel, getPedidoStatusClass } from '../../../../core/models/pedido.model';

@Component({
  selector: 'app-pedido-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido-table.html',
  styleUrls: ['./pedido-table.scss'],
})
export class PedidoTableComponent {
  @Input() pedidos: Pedido[] = [];
  @Input() loading = false;
  @Input() currentUserCargo: number | null = null;

  @Output() readonly approve = new EventEmitter<Pedido>();
  @Output() readonly purchase = new EventEmitter<Pedido>();
  @Output() readonly deliver = new EventEmitter<{ pedido: Pedido; quantidade: number }>();
  @Output() readonly remove = new EventEmitter<Pedido>();

  entregaQuantidade: Record<number, number> = {};

  getStatusLabel = getPedidoStatusLabel;
  getStatusClass = getPedidoStatusClass;

  canApprove(status: number | null): boolean {
    return status === 0;
  }

  canPurchase(status: number | null): boolean {
    return status === 1;
  }

  canDeliver(status: number | null): boolean {
    return status === 2;
  }

  isDirector(): boolean {
    return this.currentUserCargo === 1;
  }

  onDeliver(pedido: Pedido): void {
    const qtd = this.entregaQuantidade[pedido.idPedido];
    if (!qtd || qtd <= 0) {
      return;
    }
    this.deliver.emit({ pedido, quantidade: qtd });
    delete this.entregaQuantidade[pedido.idPedido];
  }
}
