from sqlalchemy.orm import Session

from app.models.matricula import Matricula
from app.models.nota import Nota
from app.schemas.nota_schema import NotaBatchSchema


def create_or_update_notas(db: Session, payload: NotaBatchSchema) -> list[Nota]:
    matriculas = db.query(Matricula).filter(
        Matricula.id_turma == payload.idTurma,
        Matricula.status == 0,
    ).all()
    matriculas_por_id = {m.id_matricula for m in matriculas}
    criadas: list[Nota] = []

    for item in payload.notas:
        if item.idMatricula not in matriculas_por_id:
            continue

        nota = db.query(Nota).filter(
            Nota.id_matricula == item.idMatricula,
            Nota.prova == payload.prova,
        ).first()

        if nota:
            nota.nota = item.nota
        else:
            nota = Nota(
                id_matricula=item.idMatricula,
                prova=payload.prova,
                nota=item.nota,
            )
            db.add(nota)
        criadas.append(nota)

    db.commit()
    for n in criadas:
        db.refresh(n)
    return criadas


def list_notas_by_matricula(db: Session, matricula_id: int) -> list[Nota]:
    return db.query(Nota).filter(Nota.id_matricula == matricula_id).order_by(Nota.prova).all()


def list_notas_by_turma(db: Session, turma_id: int, prova: int | None = None) -> list[Nota]:
    query = db.query(Nota).join(
        Matricula, Nota.id_matricula == Matricula.id_matricula
    ).filter(Matricula.id_turma == turma_id)
    if prova is not None:
        query = query.filter(Nota.prova == prova)
    return query.order_by(Nota.prova, Nota.id_nota).all()
