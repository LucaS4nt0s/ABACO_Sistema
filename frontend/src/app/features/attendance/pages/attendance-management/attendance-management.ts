import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Turma } from '../../../../core/models/turma.model';
import { Presenca, PresencaBatchPayload, PresencaItem } from '../../../../core/models/presenca.model';
import { TurmaService } from '../../../../core/services/turma.service';
import { PresencaService } from '../../../../core/services/presenca.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AttendanceListComponent, AttendanceStudentRow } from '../../components/attendance-list/attendance-list';

@Component({
  selector: 'app-attendance-management',
  standalone: true,
  imports: [CommonModule, AttendanceListComponent],
  templateUrl: './attendance-management.html',
  styleUrls: ['./attendance-management.scss'],
})
export class AttendanceManagementComponent implements OnInit {
  turmas: Turma[] = [];
  selectedTurma: Turma | null = null;
  dataAula = '';
  students: AttendanceStudentRow[] = [];
  presencasExistentes: Presenca[] = [];

  loadingTurmas = false;
  loadingPresencas = false;
  saving = false;
  localFeedback: string | null = null;

  constructor(
    private readonly turmaService: TurmaService,
    private readonly presencaService: PresencaService,
    private readonly notifications: NotificationService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadTurmas();
  }

  onTurmaChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const turmaId = Number(target.value);
    this.selectedTurma = this.turmas.find((t) => t.idTurma === turmaId) ?? null;
    this.students = [];
    this.presencasExistentes = [];

    if (this.selectedTurma && this.dataAula) {
      this.loadPresencas();
    }
    this.changeDetectorRef.detectChanges();
  }

  onDataAulaChange(dataAula: string): void {
    this.dataAula = dataAula;

    if (this.selectedTurma && this.dataAula) {
      this.loadPresencas();
    } else {
      this.students = [];
      this.presencasExistentes = [];
      this.changeDetectorRef.detectChanges();
    }
  }

  onTogglePresenca(idMatricula: number): void {
    const student = this.students.find((s) => s.idMatricula === idMatricula);
    if (student) {
      student.presente = !student.presente;
      this.changeDetectorRef.detectChanges();
    }
  }

  onSave(): void {
    if (!this.selectedTurma || !this.dataAula || this.students.length === 0) {
      return;
    }

    this.saving = true;
    this.localFeedback = null;

    const presencas: PresencaItem[] = this.students.map((s) => ({
      idMatricula: s.idMatricula,
      presente: s.presente,
    }));

    const payload: PresencaBatchPayload = {
      idTurma: this.selectedTurma.idTurma,
      dataAula: this.dataAula,
      presencas,
    };

    this.presencaService.create(payload).subscribe({
      next: () => {
        this.notifications.clear();
        this.notifications.success('Presencas registradas com sucesso.');
        this.saving = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        const message = err?.error?.detail || err?.message || 'Erro ao registrar presencas.';
        this.localFeedback = message;
        this.notifications.error(message);
        this.saving = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  private loadTurmas(): void {
    this.loadingTurmas = true;
    this.turmaService.list().subscribe({
      next: (turmas) => {
        this.turmas = turmas;
        this.loadingTurmas = false;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.loadingTurmas = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  private loadPresencas(): void {
    if (!this.selectedTurma || !this.dataAula) {
      return;
    }

    this.loadingPresencas = true;
    this.presencaService.listByTurma(this.selectedTurma.idTurma, this.dataAula).subscribe({
      next: (presencas) => {
        this.presencasExistentes = presencas;
        this.buildStudentList();
        this.loadingPresencas = false;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.presencasExistentes = [];
        this.buildStudentList();
        this.loadingPresencas = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  private buildStudentList(): void {
    if (!this.selectedTurma) {
      this.students = [];
      return;
    }

    const presencaMap = new Map<number, boolean>();
    for (const p of this.presencasExistentes) {
      if (p.presente !== null) {
        presencaMap.set(p.idMatricula, p.presente);
      }
    }

    this.students = (this.selectedTurma as any).matriculas
      ?.filter((m: any) => m.status === 0)
      .map((m: any) => ({
        idMatricula: m.idMatricula,
        nomeAluno: m.aluno?.nome ?? 'Aluno #' + m.idMatricula,
        presente: presencaMap.has(m.idMatricula) ? presencaMap.get(m.idMatricula)! : false,
      })) ?? [];
  }
}
