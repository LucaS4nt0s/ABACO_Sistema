import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Nota } from '../../../../core/models/nota.model';
import { NotaService } from '../../../../core/services/nota.service';

@Component({
  selector: 'app-student-grades',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-grades.html',
  styleUrls: ['./student-grades.scss'],
})
export class StudentGradesComponent implements OnInit {
  notas: Nota[] = [];
  alunoNome = '';
  turmaNome = '';
  matriculaId = 0;

  loading = false;
  error: string | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly notaService: NotaService,
  ) {}

  ngOnInit(): void {
    this.matriculaId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.matriculaId) {
      this.loadNotas();
    }
  }

  private loadNotas(): void {
    this.loading = true;
    this.error = null;

    this.notaService.listByMatricula(this.matriculaId).subscribe({
      next: (notas) => {
        this.notas = notas;
        this.alunoNome = notas[0]?.matricula?.aluno?.nome ?? '';
        this.turmaNome = notas[0]?.matricula?.turma?.nomeCurso ?? '';
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar as notas.';
        this.loading = false;
      },
    });
  }
}
