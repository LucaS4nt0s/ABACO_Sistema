import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Curso } from '../../../../core/models/curso.model';
import { Turma, TurmaCreatePayload, TurmaUpdatePayload } from '../../../../core/models/turma.model';
import { Usuario } from '../../../../core/models/usuario.model';
import { CursoService } from '../../../../core/services/curso.service';
import { TurmaService } from '../../../../core/services/turma.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ClassFormComponent, ClassFormSubmit } from '../../components/class-form/class-form';
import { ClassListComponent } from '../../components/class-list/class-list';

@Component({
  selector: 'app-classes-management',
  standalone: true,
  imports: [CommonModule, ClassListComponent, ClassFormComponent],
  templateUrl: './classes-management.html',
  styleUrls: ['./classes-management.scss'],
})
export class ClassesManagementComponent implements OnInit {
  turmas: Turma[] = [];
  filteredTurmas: Turma[] = [];
  pagedTurmas: Turma[] = [];

  cursos: Curso[] = [];
  professores: Usuario[] = [];

  searchTerm = '';
  currentPage = 1;
  readonly pageSize = 8;

  panelOpen = false;
  formMode: 'create' | 'edit' = 'create';
  selectedTurma: Turma | null = null;

  loadingList = false;
  saving = false;
  deletingTurmaId: number | null = null;
  localFeedback: string | null = null;

  constructor(
    private readonly turmaService: TurmaService,
    private readonly cursoService: CursoService,
    private readonly usuarioService: UsuarioService,
    private readonly notifications: NotificationService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadTurmas();
    this.loadCursos();
    this.loadProfessores();
  }

  get totalPages(): number {
    const pages = Math.ceil(this.filteredTurmas.length / this.pageSize);
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
    this.selectedTurma = null;
    this.localFeedback = null;
    this.panelOpen = true;
  }

  openEdit(turma: Turma): void {
    this.formMode = 'edit';
    this.selectedTurma = turma;
    this.localFeedback = null;
    this.panelOpen = true;
  }

  closePanel(): void {
    this.panelOpen = false;
    this.selectedTurma = null;
  }

  onSave(payload: ClassFormSubmit): void {
    this.saving = true;
    this.localFeedback = null;

    if (this.formMode === 'create') {
      const createPayload: TurmaCreatePayload = {
        idCurso: payload.idCurso,
        idProfessor: payload.idProfessor,
        capacidade: payload.capacidade,
        dataInicio: payload.dataInicio,
        dataFim: payload.dataFim,
        diasAula: payload.diasAula,
      };

      this.turmaService.create(createPayload).subscribe({
        next: () => {
          this.notifications.clear();
          this.closePanel();
          this.loadTurmas();
          this.saving = false;
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          const message = err?.error?.detail || err?.message || 'Erro ao criar turma.';
          this.notifications.error(message);
          this.saving = false;
          this.changeDetectorRef.detectChanges();
        },
      });
      return;
    }

    if (!this.selectedTurma) {
      this.saving = false;
      return;
    }

    const updatePayload: TurmaUpdatePayload = {
      idCurso: payload.idCurso,
      idProfessor: payload.idProfessor,
      capacidade: payload.capacidade,
      dataInicio: payload.dataInicio,
      dataFim: payload.dataFim,
      diasAula: payload.diasAula,
    };

    this.turmaService.update(this.selectedTurma.idTurma, updatePayload).subscribe({
      next: () => {
        this.notifications.clear();
        this.closePanel();
        this.loadTurmas();
        this.saving = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        const message = err?.error?.detail || err?.message || 'Erro ao atualizar turma.';
        this.notifications.error(message);
        this.saving = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  onDelete(turma: Turma): void {
    const displayName = turma.curso?.nomeCurso ?? `Turma #${turma.idTurma}`;
    const shouldDelete = confirm(`Excluir a turma de ${displayName}?`);
    if (!shouldDelete) {
      return;
    }

    this.deletingTurmaId = turma.idTurma;
    this.localFeedback = null;

    this.turmaService.delete(turma.idTurma).subscribe({
      next: () => {
        this.notifications.clear();
        this.loadTurmas();
        this.deletingTurmaId = null;
        this.changeDetectorRef.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409) {
          const message = 'Esta turma possui matriculas ou pedidos vinculados e nao pode ser excluida.';
          this.localFeedback = message;
          this.notifications.error(message);
        }
        this.deletingTurmaId = null;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  private loadTurmas(): void {
    this.loadingList = true;
    this.turmaService.list().subscribe({
      next: (turmas) => {
        this.turmas = turmas;
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

  private loadCursos(): void {
    this.cursoService.list().subscribe({
      next: (cursos) => {
        this.cursos = cursos;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {},
    });
  }

  private loadProfessores(): void {
    this.usuarioService.list().subscribe({
      next: (usuarios) => {
        this.professores = usuarios.filter((u) => u.cargo === 2);
        this.changeDetectorRef.detectChanges();
      },
      error: () => {},
    });
  }

  private applyFiltersAndPagination(): void {
    this.filteredTurmas = this.turmas.filter((turma) => {
      if (!this.searchTerm) {
        return true;
      }

      const cursoNome = (turma.curso?.nomeCurso ?? '').toLowerCase();
      const profNome = (turma.professor?.nome ?? '').toLowerCase();
      return cursoNome.includes(this.searchTerm) || profNome.includes(this.searchTerm);
    });

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedTurmas = this.filteredTurmas.slice(start, start + this.pageSize);
  }
}
