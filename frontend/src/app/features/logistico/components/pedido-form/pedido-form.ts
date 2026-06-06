import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Estoque } from '../../../../core/models/estoque.model';
import { EstoqueService } from '../../../../core/services/estoque.service';
import { Turma } from '../../../../core/models/turma.model';
import { TurmaService } from '../../../../core/services/turma.service';

export interface PedidoFormSubmit {
  idTurma: number;
  dataPedido: string | null;
  itens: { idItemEstoque: number; quantidade: number | null }[];
}

@Component({
  selector: 'app-pedido-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pedido-form.html',
  styleUrls: ['./pedido-form.scss'],
})
export class PedidoFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly estoqueService = inject(EstoqueService);
  private readonly turmaService = inject(TurmaService);

  @Input() loading = false;

  @Output() readonly save = new EventEmitter<PedidoFormSubmit>();
  @Output() readonly cancel = new EventEmitter<void>();

  turmas: Turma[] = [];
  estoque: Estoque[] = [];

  readonly form = this.fb.nonNullable.group({
    idTurma: [<number | null>null, [Validators.required]],
    dataPedido: [''],
    itens: this.fb.nonNullable.array([
      this.createItemGroup(),
    ]),
  });

  ngOnInit(): void {
    this.loadTurmas();
    this.loadEstoque();
  }

  get itensArray(): FormArray {
    return this.form.controls.itens;
  }

  addItem(): void {
    this.itensArray.push(this.createItemGroup());
  }

  removeItem(index: number): void {
    if (this.itensArray.length > 1) {
      this.itensArray.removeAt(index);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: PedidoFormSubmit = {
      idTurma: value.idTurma!,
      dataPedido: value.dataPedido || null,
      itens: value.itens.map((item) => ({
        idItemEstoque: item.idItemEstoque!,
        quantidade: item.quantidade ?? null,
      })),
    };

    this.save.emit(payload);
  }

  private createItemGroup() {
    return this.fb.nonNullable.group({
      idItemEstoque: [<number | null>null, [Validators.required]],
      quantidade: [<number | null>null],
    });
  }

  private loadTurmas(): void {
    this.turmaService.list().subscribe({
      next: (turmas) => {
        this.turmas = turmas;
      },
    });
  }

  private loadEstoque(): void {
    this.estoqueService.list().subscribe({
      next: (items) => {
        this.estoque = items;
      },
    });
  }
}
