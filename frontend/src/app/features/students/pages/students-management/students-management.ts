import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Aluno, AlunoCreatePayload, AlunoUpdatePayload } from '../../../../core/models/aluno.model';
import { AlunoService } from '../../../../core/services/aluno.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { StudentFormComponent, StudentFormSubmit } from '../../components/student-form/student-form';
import { StudentListComponent } from '../../components/student-list/student-list';

@Component({
  selector: 'app-students-management',
  standalone: true,
  imports: [CommonModule, StudentListComponent, StudentFormComponent],
  templateUrl: './students-management.html',
  styleUrls: ['./students-management.scss'],
})
export class StudentsManagementComponent implements OnInit {
  alunos: Aluno[] = [];
  filteredAlunos: Aluno[] = [];
  pagedAlunos: Aluno[] = [];

  searchTerm = '';
  currentPage = 1;
  readonly pageSize = 8;

  panelOpen = false;
  formMode: 'create' | 'edit' = 'create';
  selectedAluno: Aluno | null = null;

  loadingList = false;
  saving = false;
  deletingAlunoId: number | null = null;
  localFeedback: string | null = null;

  constructor(
    private readonly alunoService: AlunoService,
    private readonly notifications: NotificationService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadAlunos();
  }

  get totalPages(): number {
    const pages = Math.ceil(this.filteredAlunos.length / this.pageSize);
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
    this.selectedAluno = null;
    this.localFeedback = null;
    this.panelOpen = true;
  }

  openEdit(aluno: Aluno): void {
    this.formMode = 'edit';
    this.selectedAluno = aluno;
    this.localFeedback = null;
    this.panelOpen = true;
  }

  closePanel(): void {
    this.panelOpen = false;
    this.selectedAluno = null;
  }

  onSave(payload: StudentFormSubmit): void {
    this.saving = true;
    this.localFeedback = null;

    if (this.formMode === 'create') {
      const createPayload: AlunoCreatePayload = {
        nome: payload.nome,
        telefone: payload.telefone,
        dataNascimento: payload.dataNascimento,
        rua: payload.rua,
        bairro: payload.bairro,
        numero: payload.numero,
      };

      this.alunoService.create(createPayload).subscribe({
        next: () => {
          this.notifications.clear();
          this.closePanel();
          this.loadAlunos();
          this.saving = false;
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          const message = err?.error?.detail || err?.message || 'Erro ao criar aluno.';
          this.notifications.error(message);
          this.saving = false;
          this.changeDetectorRef.detectChanges();
        },
      });
      return;
    }

    if (!this.selectedAluno) {
      this.saving = false;
      return;
    }

    const updatePayload: AlunoUpdatePayload = {
      nome: payload.nome,
      telefone: payload.telefone,
      dataNascimento: payload.dataNascimento,
      rua: payload.rua,
      bairro: payload.bairro,
      numero: payload.numero,
    };

    this.alunoService.update(this.selectedAluno.idAluno, updatePayload).subscribe({
      next: () => {
        this.notifications.clear();
        this.closePanel();
        this.loadAlunos();
        this.saving = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        const message = err?.error?.detail || err?.message || 'Erro ao atualizar aluno.';
        this.notifications.error(message);
        this.saving = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  onDelete(aluno: Aluno): void {
    const shouldDelete = confirm(`Excluir o aluno ${aluno.nome}?`);
    if (!shouldDelete) {
      return;
    }

    this.deletingAlunoId = aluno.idAluno;
    this.localFeedback = null;

    this.alunoService.delete(aluno.idAluno).subscribe({
      next: () => {
        this.notifications.clear();
        this.loadAlunos();
        this.deletingAlunoId = null;
        this.changeDetectorRef.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409) {
          const message = 'Este aluno possui vinculos historicos em turmas e nao pode ser excluido.';
          this.localFeedback = message;
          this.notifications.error(message);
        }
        this.deletingAlunoId = null;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  private loadAlunos(): void {
    this.loadingList = true;
    this.alunoService.list().subscribe({
      next: (alunos) => {
        this.alunos = alunos;
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
    this.filteredAlunos = this.alunos.filter((aluno) => {
      if (!this.searchTerm) {
        return true;
      }

      const nome = aluno.nome.toLowerCase();
      return nome.includes(this.searchTerm);
    });

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedAlunos = this.filteredAlunos.slice(start, start + this.pageSize);
  }
}
