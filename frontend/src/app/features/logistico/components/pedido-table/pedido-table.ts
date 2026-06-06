import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Pedido } from '../../../../core/models/pedido.model';

@Component({
  selector: 'app-pedido-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedido-table.html',
  styleUrls: ['./pedido-table.scss'],
})
export class PedidoTableComponent {
  @Input() pedidos: Pedido[] = [];
  @Input() loading = false;
  @Input() currentUserCargo: number | null = null;

  @Output() readonly approve = new EventEmitter<Pedido>();
  @Output() readonly remove = new EventEmitter<Pedido>();

  getStatusLabel(status: number | null): string {
    switch (status) {
      case 0: return 'Solicitado';
      case 1: return 'Aprovado';
      case 2: return 'Entregue';
      default: return 'Desconhecido';
    }
  }

  getStatusClass(status: number | null): string {
    switch (status) {
      case 0: return 'badge badge--pending';
      case 1: return 'badge badge--approved';
      case 2: return 'badge badge--delivered';
      default: return 'badge';
    }
  }

  canApprove(status: number | null): boolean {
    return status === 0;
  }
}
