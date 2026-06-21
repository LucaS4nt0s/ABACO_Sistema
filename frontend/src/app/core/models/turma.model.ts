export interface TurmaCursoInfo {
  idCurso: number;
  nomeCurso: string;
}

export interface TurmaProfessorInfo {
  idUsuario: number;
  nome: string | null;
}

export interface Turma {
  idTurma: number;
  capacidade: number | null;
  dataInicio: string | null;
  dataFim: string | null;
  idCurso: number;
  idProfessor: number | null;
  diasAula: string | null;
  vagasOcupadas: number | null;
  curso: TurmaCursoInfo | null;
  professor: TurmaProfessorInfo | null;
}

export interface TurmaCreatePayload {
  capacidade: number | null;
  dataInicio: string | null;
  dataFim: string | null;
  idCurso: number;
  idProfessor: number | null;
  diasAula: string | null;
}

export interface TurmaUpdatePayload {
  capacidade: number | null;
  dataInicio: string | null;
  dataFim: string | null;
  idCurso: number | null;
  idProfessor: number | null;
  diasAula: string | null;
}
