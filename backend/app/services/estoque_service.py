from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.estoque import Estoque
from app.schemas.estoque_schema import EstoqueCreateSchema, EstoqueUpdateSchema


class EstoqueNotFoundError(Exception):
    pass


class EstoqueHasDependenciesError(Exception):
    pass


def create_estoque(db: Session, payload: EstoqueCreateSchema) -> Estoque:
    existing = db.query(Estoque).filter(
        func.lower(Estoque.nome_item) == func.lower(payload.nomeItem.strip())
    ).first()

    if existing:
        existing.quantidade_disponivel = (existing.quantidade_disponivel or 0) + (payload.quantidadeDisponivel or 0)
        db.commit()
        db.refresh(existing)
        return existing

    estoque = Estoque(
        nome_item=payload.nomeItem.strip(),
        quantidade_disponivel=payload.quantidadeDisponivel,
        unidade=payload.unidade,
    )
    db.add(estoque)
    db.commit()
    db.refresh(estoque)
    return estoque


def list_estoque(db: Session) -> list[Estoque]:
    return db.query(Estoque).order_by(Estoque.nome_item).all()


def search_estoque_by_name(db: Session, term: str) -> list[Estoque]:
    return db.query(Estoque).filter(
        Estoque.nome_item.ilike(f"%{term}%")
    ).order_by(Estoque.nome_item).all()


def get_estoque_by_id(db: Session, estoque_id: int) -> Estoque:
    estoque = db.query(Estoque).filter(Estoque.id_item_estoque == estoque_id).first()
    if not estoque:
        raise EstoqueNotFoundError
    return estoque


def update_estoque(db: Session, estoque_id: int, payload: EstoqueUpdateSchema) -> Estoque:
    estoque = get_estoque_by_id(db, estoque_id)

    if payload.nomeItem is not None:
        estoque.nome_item = payload.nomeItem
    if payload.quantidadeDisponivel is not None:
        estoque.quantidade_disponivel = payload.quantidadeDisponivel
    if payload.unidade is not None:
        estoque.unidade = payload.unidade

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise EstoqueHasDependenciesError from exc

    db.refresh(estoque)
    return estoque


def delete_estoque(db: Session, estoque_id: int) -> None:
    estoque = get_estoque_by_id(db, estoque_id)
    db.delete(estoque)

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise EstoqueHasDependenciesError from exc
