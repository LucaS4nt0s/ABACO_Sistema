import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Aluno } from '../../../../core/models/aluno.model';
import { Matricula, MatriculaCreatePayload, MatriculaUpdatePayload } from '../../../../core/models/matricula.model';
import { Turma } from '../../../../core/models/turma.model';
import { AlunoService } from '../../../../core/services/aluno.service';
import { MatriculaService } from '../../../../core/services/matricula.service';
import { TurmaService } from '../../../../core/services/turma.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { EnrollmentFormComponent, EnrollmentFormSubmit } from '../../components/enrollment-form/enrollment-form';
import { EnrollmentListComponent } from '../../components/enrollment-list/enrollment-list';

@Component({
  selector: 'app-enrollments-management',
  standalone: true,
  imports: [CommonModule, EnrollmentListComponent, EnrollmentFormComponent],
  templateUrl: './enrollments-management.html',
  styleUrls: ['./enrollments-management.scss'],
})
export class EnrollmentsManagementComponent implements OnInit {
  matriculas: Matricula[] = [];
  filteredMatriculas: Matricula[] = [];
  pagedMatriculas: Matricula[] = [];

  alunos: Aluno[] = [];
  turmas: Turma[] = [];

  searchTerm = '';
  currentPage = 1;
  readonly pageSize = 8;

  panelOpen = false;
  formMode: 'create' | 'edit' = 'create';
  selectedMatricula: Matricula | null = null;

  loadingList = false;
  saving = false;
  deletingMatriculaId: number | null = null;
  localFeedback: string | null = null;

  constructor(
    private readonly matriculaService: MatriculaService,
    private readonly alunoService: AlunoService,
    private readonly turmaService: TurmaService,
    private readonly notifications: NotificationService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadMatriculas();
    this.loadAlunos();
    this.loadTurmas();
  }

  get totalPages(): number {
    const pages = Math.ceil(this.filteredMatriculas.length / this.pageSize);
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
    this.selectedMatricula = null;
    this.localFeedback = null;
    this.panelOpen = true;
  }

  openEdit(matricula: Matricula): void {
    this.formMode = 'edit';
    this.selectedMatricula = matricula;
    this.localFeedback = null;
    this.panelOpen = true;
  }

  closePanel(): void {
    this.panelOpen = false;
    this.selectedMatricula = null;
  }

  onSave(payload: EnrollmentFormSubmit): void {
    this.saving = true;
    this.localFeedback = null;

    if (this.formMode === 'create') {
      const createPayload: MatriculaCreatePayload = {
        idAluno: payload.idAluno,
        idTurma: payload.idTurma,
        dataMatricula: payload.dataMatricula,
        status: payload.status,
      };

      this.matriculaService.create(createPayload).subscribe({
        next: () => {
          this.notifications.clear();
          this.closePanel();
          this.loadMatriculas();
          this.saving = false;
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          const message = err?.error?.detail || err?.message || 'Erro ao criar matricula.';
          this.notifications.error(message);
          this.saving = false;
          this.changeDetectorRef.detectChanges();
        },
      });
      return;
    }

    if (!this.selectedMatricula) {
      this.saving = false;
      return;
    }

    const updatePayload: MatriculaUpdatePayload = {
      idAluno: payload.idAluno,
      idTurma: payload.idTurma,
      dataMatricula: payload.dataMatricula,
      status: payload.status,
    };

    this.matriculaService.update(this.selectedMatricula.idMatricula, updatePayload).subscribe({
      next: () => {
        this.notifications.clear();
        this.closePanel();
        this.loadMatriculas();
        this.saving = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        const message = err?.error?.detail || err?.message || 'Erro ao atualizar matricula.';
        this.notifications.error(message);
        this.saving = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  onDelete(matricula: Matricula): void {
    const alunoNome = matricula.aluno?.nome ?? 'Matricula #' + matricula.idMatricula;
    const shouldDelete = confirm('Excluir matricula de ' + alunoNome + '?');
    if (!shouldDelete) {
      return;
    }

    this.deletingMatriculaId = matricula.idMatricula;
    this.localFeedback = null;

    this.matriculaService.delete(matricula.idMatricula).subscribe({
      next: () => {
        this.notifications.clear();
        this.loadMatriculas();
        this.deletingMatriculaId = null;
        this.changeDetectorRef.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409) {
          const message = 'Esta matricula possui vinculos e nao pode ser excluida.';
          this.localFeedback = message;
          this.notifications.error(message);
        }
        this.deletingMatriculaId = null;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  private loadMatriculas(): void {
    this.loadingList = true;
    this.matriculaService.list().subscribe({
      next: (matriculas) => {
        this.matriculas = matriculas;
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

  private loadAlunos(): void {
    this.alunoService.list().subscribe({
      next: (alunos) => {
        this.alunos = alunos;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {},
    });
  }

  private loadTurmas(): void {
    this.turmaService.list().subscribe({
      next: (turmas) => {
        this.turmas = turmas;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {},
    });
  }

  private applyFiltersAndPagination(): void {
    this.filteredMatriculas = this.matriculas.filter((m) => {
      if (!this.searchTerm) {
        return true;
      }

      const alunoNome = (m.aluno?.nome ?? '').toLowerCase();
      const turmaCurso = (m.turma?.curso?.nomeCurso ?? '').toLowerCase();
      return alunoNome.includes(this.searchTerm) || turmaCurso.includes(this.searchTerm);
    });

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedMatriculas = this.filteredMatriculas.slice(start, start + this.pageSize);
  }
}