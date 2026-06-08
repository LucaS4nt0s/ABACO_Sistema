import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, decodePayload, getStoredToken } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Pedido, getPedidoStatusLabel, getPedidoStatusClass } from '../../../../core/models/pedido.model';
import { PedidoService } from '../../../../core/services/pedido.service';
import { PedidoTableComponent } from '../../components/pedido-table/pedido-table';

@Component({
  selector: 'app-pedido-list',
  standalone: true,
  imports: [CommonModule, PedidoTableComponent],
  templateUrl: './pedido-list.html',
  styleUrls: ['./pedido-list.scss'],
})
export class PedidoListComponent implements OnInit {
  pedidos: Pedido[] = [];
  activeTab: 'todos' | 'lista-compras' = 'todos';

  loadingList = false;
  currentUserCargo: number | null = null;

  constructor(
    private readonly pedidoService: PedidoService,
    private readonly authService: AuthService,
    private readonly notifications: NotificationService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const token = getStoredToken();
    if (token) {
      const payload = decodePayload(token);
      this.currentUserCargo = payload.cargo ?? null;
    }
    this.loadPedidos();
  }

  get approvedPedidos(): Pedido[] {
    return this.pedidos.filter((p) => p.status !== null && p.status! >= 1);
  }

  get filteredPedidos(): Pedido[] {
    if (this.activeTab === 'lista-compras') {
      return this.approvedPedidos;
    }
    return this.pedidos;
  }

  setTab(tab: 'todos' | 'lista-compras'): void {
    this.activeTab = tab;
  }

  onApprove(pedido: Pedido): void {
    const shouldApprove = confirm(`Aprovar o pedido #${pedido.idPedido}?`);
    if (!shouldApprove) {
      return;
    }

    this.pedidoService.aprovar(pedido.idPedido).subscribe({
      next: () => {
        this.notifications.clear();
        this.loadPedidos();
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        const message = err?.error?.detail || err?.message || 'Erro ao aprovar pedido.';
        this.notifications.error(message);
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  onPurchase(pedido: Pedido): void {
    const shouldPurchase = confirm(`Marcar pedido #${pedido.idPedido} como comprado?`);
    if (!shouldPurchase) {
      return;
    }

    this.pedidoService.comprar(pedido.idPedido).subscribe({
      next: () => {
        this.notifications.clear();
        this.loadPedidos();
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        const message = err?.error?.detail || err?.message || 'Erro ao marcar pedido como comprado.';
        this.notifications.error(message);
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  onDeliver(pedido: Pedido): void {
    const shouldDeliver = confirm(`Entregar pedido #${pedido.idPedido}? Os itens serao adicionados ao estoque.`);
    if (!shouldDeliver) {
      return;
    }

    this.pedidoService.entregar(pedido.idPedido).subscribe({
      next: () => {
        this.notifications.clear();
        this.loadPedidos();
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        const message = err?.error?.detail || err?.message || 'Erro ao entregar pedido.';
        this.notifications.error(message);
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  onDelete(pedido: Pedido): void {
    const shouldDelete = confirm(`Excluir o pedido #${pedido.idPedido}?`);
    if (!shouldDelete) {
      return;
    }

    this.pedidoService.delete(pedido.idPedido).subscribe({
      next: () => {
        this.notifications.clear();
        this.loadPedidos();
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        const message = err?.error?.detail || err?.message || 'Erro ao excluir pedido.';
        this.notifications.error(message);
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  newPedido(): void {
    this.router.navigate(['/admin/logistico/pedidos/novo']);
  }

  private loadPedidos(): void {
    this.loadingList = true;
    this.pedidoService.list().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.loadingList = false;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.loadingList = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }
}
