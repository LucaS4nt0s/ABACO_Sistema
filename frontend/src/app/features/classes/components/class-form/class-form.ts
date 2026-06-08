import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { Curso } from '../../../../core/models/curso.model';
import { Turma } from '../../../../core/models/turma.model';
import { Usuario } from '../../../../core/models/usuario.model';

export interface ClassFormSubmit {
  capacidade: number | null;
  dataInicio: string | null;
  dataFim: string | null;
  idCurso: number;
  idProfessor: number | null;
  diasAula: string | null;
}

interface DiaSemana {
  label: string;
  value: number;
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

  readonly diasSemana: DiaSemana[] = [
    { label: 'Dom', value: 0 },
    { label: 'Seg', value: 1 },
    { label: 'Ter', value: 2 },
    { label: 'Qua', value: 3 },
    { label: 'Qui', value: 4 },
    { label: 'Sex', value: 5 },
    { label: 'Sab', value: 6 },
  ];

  readonly form = this.fb.nonNullable.group({
    idCurso: [0, [Validators.required, Validators.min(1)]],
    idProfessor: [0],
    capacidade: [0],
    dataInicio: [''],
    dataFim: [''],
    diasAula: this.fb.array(this.diasSemana.map(() => false)),
  });

  get diasAulaArray(): FormArray {
    return this.form.controls.diasAula as FormArray;
  }

  get diasAulaControls(): FormControl[] {
    return (this.form.controls.diasAula as FormArray).controls as FormControl[];
  }

  get diasAulaString(): string | null {
    const selected = this.diasAulaArray.value
      .map((checked: boolean, i: number) => checked ? this.diasSemana[i].value : null)
      .filter((v: number | null) => v !== null);
    return selected.length > 0 ? selected.join(',') : null;
  }

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
      diasAula: this.diasAulaString,
    };

    this.save.emit(payload);
  }

  private patchForm(): void {
    if (this.mode === 'edit' && this.turma) {
      const diasSelecionados = (this.turma.diasAula ?? '').split(',').map(Number);
      const diasArray = this.diasSemana.map((d) => diasSelecionados.includes(d.value));

      this.form.reset({
        idCurso: this.turma.idCurso,
        idProfessor: this.turma.idProfessor ?? 0,
        capacidade: this.turma.capacidade ?? 0,
        dataInicio: this.turma.dataInicio ?? '',
        dataFim: this.turma.dataFim ?? '',
      });
      this.diasAulaArray.patchValue(diasArray);
      return;
    }

    this.form.reset({
      idCurso: 0,
      idProfessor: 0,
      capacidade: 0,
      dataInicio: '',
      dataFim: '',
    });
    this.diasAulaArray.patchValue(this.diasSemana.map(() => false));
  }

  private toggleFormState(): void {
    if (this.loading) {
      this.form.disable({ emitEvent: false });
      return;
    }

    this.form.enable({ emitEvent: false });
  }
}
