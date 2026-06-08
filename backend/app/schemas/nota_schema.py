from pydantic import BaseModel, ConfigDict, Field


class NotaItemSchema(BaseModel):
    idMatricula: int
    nota: float | None = None


class NotaBatchSchema(BaseModel):
    idTurma: int
    prova: int
    notas: list[NotaItemSchema]


class NotaAlunoInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    id_aluno: int = Field(alias="idAluno")
    nome: str | None = None


class NotaTurmaInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    id_turma: int = Field(alias="idTurma")
    nome_curso: str | None = Field(None, alias="nomeCurso")


class NotaMatriculaInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    id_matricula: int = Field(alias="idMatricula")
    aluno: NotaAlunoInfo | None = None
    turma: NotaTurmaInfo | None = None


class NotaResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    id_nota: int = Field(alias="idNota")
    id_matricula: int = Field(alias="idMatricula")
    nota: float | None = None
    prova: int | None = None
    matricula: NotaMatriculaInfo | None = None
