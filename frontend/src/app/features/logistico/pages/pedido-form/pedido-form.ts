import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';

import { NotificationService } from '../../../../core/services/notification.service';
import { PedidoCreatePayload } from '../../../../core/models/pedido.model';
import { PedidoService } from '../../../../core/services/pedido.service';
import { PedidoFormComponent, PedidoFormSubmit } from '../../components/pedido-form/pedido-form';

@Component({
  selector: 'app-pedido-form-page',
  standalone: true,
  imports: [CommonModule, PedidoFormComponent],
  templateUrl: './pedido-form.html',
  styleUrls: ['./pedido-form.scss'],
})
export class PedidoFormPageComponent {
  saving = false;

  constructor(
    private readonly pedidoService: PedidoService,
    private readonly notifications: NotificationService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly router: Router,
  ) {}

  onSave(payload: PedidoFormSubmit): void {
    this.saving = true;

    const createPayload: PedidoCreatePayload = {
      idTurma: payload.idTurma,
      dataPedido: payload.dataPedido,
      itens: payload.itens.map((item) => ({
        nomeItem: item.nomeItem,
        quantidade: item.quantidade,
        idItemEstoque: item.idItemEstoque ?? null,
        precoUnitario: null,
      })),
    };

    this.pedidoService.create(createPayload).subscribe({
      next: () => {
        this.notifications.success('Pedido criado com sucesso.');
        this.saving = false;
        this.changeDetectorRef.detectChanges();
        this.router.navigate(['/academico/pedidos']);
      },
      error: (err) => {
        const message = err?.error?.detail || err?.message || 'Erro ao criar pedido.';
        this.notifications.error(message);
        this.saving = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/academico/pedidos']);
  }
}
