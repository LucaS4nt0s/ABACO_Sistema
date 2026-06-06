import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Curso } from '../../../../core/models/curso.model';
import { Turma } from '../../../../core/models/turma.model';
import { Usuario } from '../../../../core/models/usuario.model';

export interface ClassFormSubmit {
  capacidade: number | null;
  dataInicio: string | null;
  dataFim: string | null;
  idCurso: number;
  idProfessor: number | null;
}

@Component({
  selector: 'app-class-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './class-form.html',
  styleUrls: ['./class-form.scss'],
})
export class ClassFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() mode: 'create' | 'edit' = 'create';
  @Input() turma: Turma | null = null;
  @Input() cursos: Curso[] = [];
  @Input() professores: Usuario[] = [];
  @Input() loading = false;

  @Output() readonly save = new EventEmitter<ClassFormSubmit>();
  @Output() readonly cancel = new EventEmitter<void>();

  readonly form = this.fb.nonNullable.group({
    idCurso: [0, [Validators.required, Validators.min(1)]],
    idProfessor: [0],
    capacidade: [0],
    dataInicio: [''],
    dataFim: [''],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode'] || changes['turma']) {
      this.patchForm();
    }

    if (changes['loading']) {
      this.toggleFormState();
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: ClassFormSubmit = {
      idCurso: value.idCurso,
      idProfessor: value.idProfessor > 0 ? value.idProfessor : null,
      capacidade: value.capacidade > 0 ? value.capacidade : null,
      dataInicio: value.dataInicio || null,
      dataFim: value.dataFim || null,
    };

    this.save.emit(payload);
  }

  private patchForm(): void {
    if (this.mode === 'edit' && this.turma) {
      this.form.reset({
        idCurso: this.turma.idCurso,
        idProfessor: this.turma.idProfessor ?? 0,
        capacidade: this.turma.capacidade ?? 0,
        dataInicio: this.turma.dataInicio ?? '',
        dataFim: this.turma.dataFim ?? '',
      });
      return;
    }

    this.form.reset({
      idCurso: 0,
      idProfessor: 0,
      capacidade: 0,
      dataInicio: '',
      dataFim: '',
    });
  }

  private toggleFormState(): void {
    if (this.loading) {
      this.form.disable({ emitEvent: false });
      return;
    }

    this.form.enable({ emitEvent: false });
  }
}
