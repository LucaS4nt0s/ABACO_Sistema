import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface GradeStudentRow {
  idMatricula: number;
  nomeAluno: string;
  nota: number | null;
}

@Component({
  selector: 'app-grades-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grades-list.html',
  styleUrls: ['./grades-list.scss'],
})
export class GradesListComponent {
  @Input() students: GradeStudentRow[] = [];
  @Input() loading = false;
  @Input() turmaNome = '';
  @Input() prova = 1;
  @Input() saving = false;

  @Output() readonly notaChange = new EventEmitter<{ idMatricula: number; nota: number | null }>();
  @Output() readonly provaChange = new EventEmitter<number>();

  onProvaChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.provaChange.emit(Number(target.value));
  }

  onNotaInput(idMatricula: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim();
    const nota = value === '' ? null : Number(value);
    this.notaChange.emit({ idMatricula, nota });
  }
}
