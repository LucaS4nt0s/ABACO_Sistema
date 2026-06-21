import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurmaService } from '../../../../core/services/turma.service';
import { MatriculaService } from '../../../../core/services/matricula.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Turma } from '../../../../core/models/turma.model';
import { Matricula } from '../../../../core/models/matricula.model';

interface AlunoRow {
  nome: string;
  telefone: string;
  turma: string;
  status: string;
}

@Component({
  selector: 'app-alunos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alunos.html',
  styleUrls: ['./alunos.scss'],
})
export class AlunosPage implements OnInit {
  alunos: AlunoRow[] = [];
  turmas: Turma[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private readonly turmaService: TurmaService,
    private readonly matriculaService: MatriculaService,
    private readonly notifications: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    this.error = null;

    this.turmaService.listMine().subscribe({
      next: (turmas) => {
        this.turmas = turmas;
        if (turmas.length === 0) {
          this.loading = false;
          return;
        }
        this.loadMatriculas();
      },
      error: () => {
        this.loading = false;
        this.error = 'Erro ao carregar turmas.';
        this.notifications.error('Erro ao carregar turmas.');
      },
    });
  }

  private loadMatriculas(): void {
    this.matriculaService.list().subscribe({
      next: (matriculas) => {
        const turmaIds = new Set(this.turmas.map((t) => t.idTurma));
        const statusNomes: Record<number, string> = { 0: 'Ativa', 1: 'Concluída', 2: 'Cancelada' };

        this.alunos = matriculas
          .filter((m) => turmaIds.has(m.idTurma))
          .map((m) => ({
            nome: m.aluno?.nome ?? `Aluno #${m.idAluno}`,
            telefone: m.aluno?.telefone ?? '—',
            turma: this.turmas.find((t) => t.idTurma === m.idTurma)?.curso?.nomeCurso ?? `Turma #${m.idTurma}`,
            status: statusNomes[m.status ?? 0] ?? 'Desconhecido',
          }));

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Erro ao carregar matrículas.';
        this.notifications.error('Erro ao carregar matrículas.');
      },
    });
  }
}
