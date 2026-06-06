from datetime import date

from pydantic import BaseModel, ConfigDict, Field


class TurmaCreateSchema(BaseModel):
    capacidade: int | None = None
    dataInicio: date | None = None
    dataFim: date | None = None
    idCurso: int
    idProfessor: int | None = None


class TurmaUpdateSchema(BaseModel):
    capacidade: int | None = None
    dataInicio: date | None = None
    dataFim: date | None = None
    idCurso: int | None = None
    idProfessor: int | None = None


class TurmaCursoInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id_curso: int = Field(alias="idCurso")
    nome_curso: str = Field(alias="nomeCurso")


class TurmaProfessorInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id_usuario: int = Field(alias="idUsuario")
    nome: str | None = None


class TurmaResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id_turma: int = Field(alias="idTurma")
    capacidade: int | None = None
    data_inicio: date | None = Field(None, alias="dataInicio")
    data_fim: date | None = Field(None, alias="dataFim")
    id_curso: int = Field(alias="idCurso")
    id_professor: int | None = Field(None, alias="idProfessor")
    curso: TurmaCursoInfo | None = None
    professor: TurmaProfessorInfo | None = None
