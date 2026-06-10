import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurmaService } from '../../../../core/services/turma.service';
import { Turma } from '../../../../core/models/turma.model';

@Component({
  selector: 'app-turmas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './turmas.html',
  styleUrls: ['./turmas.scss'],
})
export class TurmasPage implements OnInit {
  turmas: Turma[] = [];
  loading = true;
  error: string | null = null;

  constructor(private readonly turmaService: TurmaService) {}

  ngOnInit(): void {
    this.turmaService.listMine().subscribe({
      next: (turmas) => {
        this.turmas = turmas;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar turmas';
        this.loading = false;
      },
    });
  }
}
