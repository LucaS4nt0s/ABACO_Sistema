import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

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
  estoqueItems: Estoque[] = [];
  filteredEstoque: Estoque[][] = [];
  searchTerms: Subject<string>[] = [];
  showDropdown: boolean[] = [];

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
    setTimeout(() => this.searchTerms.forEach((_, i) => this.setupSearch(i)));
  }

  get itensArray(): FormArray {
    return this.form.controls.itens;
  }

  addItem(): void {
    this.itensArray.push(this.createItemGroup());
    const idx = this.searchTerms.length - 1;
    this.setupSearch(idx);
  }

  removeItem(index: number): void {
    if (this.itensArray.length > 1) {
      this.itensArray.removeAt(index);
      this.filteredEstoque.splice(index, 1);
      this.showDropdown.splice(index, 1);
      this.searchTerms.splice(index, 1);
    }
  }

  onSearchInput(index: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (this.searchTerms[index]) {
      this.searchTerms[index].next(value);
    }
  }

  selectItem(index: number, item: Estoque): void {
    const group = this.itensArray.at(index);
    group.patchValue({ idItemEstoque: item.idItemEstoque });
    this.showDropdown[index] = false;

    const input = document.getElementById(`item-search-${index}`) as HTMLInputElement;
    if (input) {
      input.value = `${item.nomeItem} (${item.quantidadeDisponivel ?? '?'} ${item.unidade ?? ''})`;
    }
  }

  hasFilteredItems(index: number): boolean {
    return (this.filteredEstoque[index]?.length ?? 0) > 0;
  }

  onFocus(index: number): void {
    this.showDropdown[index] = true;
  }

  onBlur(index: number): void {
    setTimeout(() => {
      this.showDropdown[index] = false;
    }, 200);
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
    this.filteredEstoque.push([]);
    this.showDropdown.push(false);
    this.searchTerms.push(new Subject<string>());
    return this.fb.nonNullable.group({
      idItemEstoque: [<number | null>null, [Validators.required]],
      quantidade: [<number | null>null],
    });
  }

  private setupSearch(index: number): void {
    this.searchTerms[index].pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => {
        if (!term || term.trim().length === 0) {
          return [this.estoqueItems];
        }
        return this.estoqueService.search(term);
      }),
    ).subscribe((items) => {
      this.filteredEstoque[index] = items;
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
        this.estoqueItems = items;
        this.filteredEstoque = this.filteredEstoque.map(() => [...items]);
      },
    });
  }
}
