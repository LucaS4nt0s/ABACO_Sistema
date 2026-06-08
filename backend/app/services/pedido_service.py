from datetime import date

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.item_pedido import ItemPedido
from app.models.pedido import Pedido
from app.schemas.pedido_schema import PedidoCreateSchema, PedidoUpdateSchema


class PedidoNotFoundError(Exception):
    pass


class PedidoHasDependenciesError(Exception):
    pass


class TurmaNotFoundForPedidoError(Exception):
    pass


class EstoqueNotFoundForPedidoError(Exception):
    pass


class InsufficientStockError(Exception):
    pass


class PedidoCannotBeDeliveredError(Exception):
    pass


class PedidoInvalidTransitionError(Exception):
    pass


def _resolve_turma(db: Session, turma_id: int) -> None:
    from app.models.turma import Turma

    turma = db.query(Turma).filter(Turma.id_turma == turma_id).first()
    if not turma:
        raise TurmaNotFoundForPedidoError


def _resolve_estoque(db: Session, estoque_id: int) -> None:
    from app.models.estoque import Estoque

    estoque = db.query(Estoque).filter(Estoque.id_item_estoque == estoque_id).first()
    if not estoque:
        raise EstoqueNotFoundForPedidoError


def create_pedido(db: Session, payload: PedidoCreateSchema, usuario_id: int) -> Pedido:
    _resolve_turma(db, payload.idTurma)
    for item in payload.itens:
        _resolve_estoque(db, item.idItemEstoque)

    pedido = Pedido(
        id_usuario=usuario_id,
        id_turma=payload.idTurma,
        data_pedido=payload.dataPedido or date.today(),
        status=0,
    )
    db.add(pedido)
    db.flush()

    for item in payload.itens:
        item_pedido = ItemPedido(
            id_pedido=pedido.id_pedido,
            id_item_estoque=item.idItemEstoque,
            quantidade=item.quantidade,
            preco_unitario=item.precoUnitario,
        )
        db.add(item_pedido)

    db.commit()
    db.refresh(pedido)
    return pedido


def list_pedidos(db: Session) -> list[Pedido]:
    return db.query(Pedido).order_by(Pedido.id_pedido.desc()).all()


def get_pedido_by_id(db: Session, pedido_id: int) -> Pedido:
    pedido = db.query(Pedido).filter(Pedido.id_pedido == pedido_id).first()
    if not pedido:
        raise PedidoNotFoundError
    return pedido


def aprovar_pedido(db: Session, pedido_id: int) -> Pedido:
    pedido = get_pedido_by_id(db, pedido_id)

    if pedido.status != 0:
        raise PedidoInvalidTransitionError("Apenas pedidos com status 'Solicitado' podem ser aprovados")

    pedido.status = 1

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise PedidoHasDependenciesError from exc

    db.refresh(pedido)
    return pedido


def comprar_pedido(db: Session, pedido_id: int) -> Pedido:
    pedido = get_pedido_by_id(db, pedido_id)

    if pedido.status != 1:
        raise PedidoInvalidTransitionError("Apenas pedidos com status 'Aprovado' podem ser marcados como comprados")

    pedido.status = 2

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise PedidoHasDependenciesError from exc

    db.refresh(pedido)
    return pedido


def update_pedido_status(db: Session, pedido_id: int, payload: PedidoUpdateSchema) -> Pedido:
    pedido = get_pedido_by_id(db, pedido_id)

    if payload.status not in (1, 2):
        raise PedidoInvalidTransitionError(
            "Transição de status inválida. Use os endpoints específicos para aprovar, comprar ou entregar."
        )

    expected_previous = 0 if payload.status == 1 else 1
    if pedido.status != expected_previous:
        raise PedidoInvalidTransitionError(
            f"Não é possível alterar o status de {pedido.status} para {payload.status}"
        )

    pedido.status = payload.status

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise PedidoHasDependenciesError from exc

    db.refresh(pedido)
    return pedido


def entregar_pedido(db: Session, pedido_id: int) -> Pedido:
    from app.models.estoque import Estoque

    pedido = get_pedido_by_id(db, pedido_id)

    if pedido.status != 2:
        raise PedidoCannotBeDeliveredError

    pedido.status = 3

    for item_pedido in pedido.itens:
        estoque_item = db.query(Estoque).filter(
            Estoque.id_item_estoque == item_pedido.id_item_estoque
        ).first()
        if estoque_item and item_pedido.quantidade:
            estoque_item.quantidade_disponivel = (estoque_item.quantidade_disponivel or 0) + item_pedido.quantidade

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise PedidoHasDependenciesError from exc

    db.refresh(pedido)
    return pedido


def delete_pedido(db: Session, pedido_id: int) -> None:
    pedido = get_pedido_by_id(db, pedido_id)
    db.delete(pedido)

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise PedidoHasDependenciesError from exc
