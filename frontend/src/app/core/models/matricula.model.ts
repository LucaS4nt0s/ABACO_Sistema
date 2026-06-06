export interface MatriculaAlunoInfo {
  idAluno: number;
  nome: string | null;
}

export interface MatriculaTurmaInfo {
  idTurma: number;
  curso: string | null;
}

export interface Matricula {
  idMatricula: number;
  idAluno: number;
  idTurma: number;
  dataMatricula: string | null;
  status: number | null;
  aluno: MatriculaAlunoInfo | null;
  turma: MatriculaTurmaInfo | null;
}

export interface MatriculaCreatePayload {
  idAluno: number;
  idTurma: number;
  dataMatricula: string | null;
  status: number | null;
}

export interface MatriculaUpdatePayload {
  idAluno: number | null;
  idTurma: number | null;
  dataMatricula: string | null;
  status: number | null;
}
