import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Estoque, EstoqueCreatePayload, EstoqueUpdatePayload } from '../../../../core/models/estoque.model';
import { EstoqueService } from '../../../../core/services/estoque.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { EstoqueFormComponent, EstoqueFormSubmit } from '../../components/estoque-form/estoque-form';
import { EstoqueListComponent } from '../../components/estoque-list/estoque-list';

@Component({
  selector: 'app-estoque-management',
  standalone: true,
  imports: [CommonModule, EstoqueListComponent, EstoqueFormComponent],
  templateUrl: './estoque-management.html',
  styleUrls: ['./estoque-management.scss'],
})
export class EstoqueManagementComponent implements OnInit {
  estoque: Estoque[] = [];
  filteredEstoque: Estoque[] = [];
  pagedEstoque: Estoque[] = [];

  searchTerm = '';
  currentPage = 1;
  readonly pageSize = 8;

  panelOpen = false;
  formMode: 'create' | 'edit' = 'create';
  selectedItem: Estoque | null = null;

  loadingList = false;
  saving = false;
  deletingEstoqueId: number | null = null;
  localFeedback: string | null = null;

  constructor(
    private readonly estoqueService: EstoqueService,
    private readonly notifications: NotificationService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadEstoque();
  }

  get totalPages(): number {
    const pages = Math.ceil(this.filteredEstoque.length / this.pageSize);
    return pages > 0 ? pages : 1;
  }

  onSearch(term: string): void {
    this.searchTerm = term.trim().toLowerCase();
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyFiltersAndPagination();
  }

  openCreate(): void {
    this.formMode = 'create';
    this.selectedItem = null;
    this.localFeedback = null;
    this.panelOpen = true;
  }

  openEdit(item: Estoque): void {
    this.formMode = 'edit';
    this.selectedItem = item;
    this.localFeedback = null;
    this.panelOpen = true;
  }

  closePanel(): void {
    this.panelOpen = false;
    this.selectedItem = null;
  }

  onSave(payload: EstoqueFormSubmit): void {
    this.saving = true;
    this.localFeedback = null;

    if (this.formMode === 'create') {
      const createPayload: EstoqueCreatePayload = {
        nomeItem: payload.nomeItem,
        quantidadeDisponivel: payload.quantidadeDisponivel,
        unidade: payload.unidade,
      };

      this.estoqueService.create(createPayload).subscribe({
        next: () => {
          this.notifications.clear();
          this.closePanel();
          this.loadEstoque();
          this.saving = false;
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          const message = err?.error?.detail || err?.message || 'Erro ao criar item.';
          this.notifications.error(message);
          this.saving = false;
          this.changeDetectorRef.detectChanges();
        },
      });
      return;
    }

    if (!this.selectedItem) {
      this.saving = false;
      return;
    }

    const updatePayload: EstoqueUpdatePayload = {
      nomeItem: payload.nomeItem,
      quantidadeDisponivel: payload.quantidadeDisponivel,
      unidade: payload.unidade,
    };

    this.estoqueService.update(this.selectedItem.idItemEstoque, updatePayload).subscribe({
      next: () => {
        this.notifications.clear();
        this.closePanel();
        this.loadEstoque();
        this.saving = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        const message = err?.error?.detail || err?.message || 'Erro ao atualizar item.';
        this.notifications.error(message);
        this.saving = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  onDelete(item: Estoque): void {
    const shouldDelete = confirm(`Excluir o item ${item.nomeItem}?`);
    if (!shouldDelete) {
      return;
    }

    this.deletingEstoqueId = item.idItemEstoque;
    this.localFeedback = null;

    this.estoqueService.delete(item.idItemEstoque).subscribe({
      next: () => {
        this.notifications.clear();
        this.loadEstoque();
        this.deletingEstoqueId = null;
        this.changeDetectorRef.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409) {
          const message = 'Este item possui pedidos vinculados e nao pode ser excluido.';
          this.localFeedback = message;
          this.notifications.error(message);
        }
        this.deletingEstoqueId = null;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  private loadEstoque(): void {
    this.loadingList = true;
    this.estoqueService.list().subscribe({
      next: (items) => {
        this.estoque = items;
        this.applyFiltersAndPagination();
        this.loadingList = false;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.loadingList = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  private applyFiltersAndPagination(): void {
    this.filteredEstoque = this.estoque.filter((item) => {
      if (!this.searchTerm) {
        return true;
      }

      const nome = (item.nomeItem ?? '').toLowerCase();
      return nome.includes(this.searchTerm);
    });

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedEstoque = this.filteredEstoque.slice(start, start + this.pageSize);
  }
}
