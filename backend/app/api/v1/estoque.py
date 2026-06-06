from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import verify_cargo
from app.db.database import get_db
from app.schemas.estoque_schema import EstoqueCreateSchema, EstoqueResponseSchema, EstoqueUpdateSchema
from app.services.estoque_service import (
    EstoqueHasDependenciesError,
    EstoqueNotFoundError,
    create_estoque,
    delete_estoque,
    get_estoque_by_id,
    list_estoque,
    update_estoque,
)

router = APIRouter(prefix="/api/v1/estoque", tags=["estoque"])


@router.get("")
def read_estoque(_current_user: dict = Depends(verify_cargo(1, 2, 3)), db: Session = Depends(get_db)):
    return [EstoqueResponseSchema.model_validate(item) for item in list_estoque(db)]


@router.get("/{estoque_id}")
def read_estoque_item(estoque_id: int, _current_user: dict = Depends(verify_cargo(1, 2, 3)), db: Session = Depends(get_db)):
    try:
        item = get_estoque_by_id(db, estoque_id)
    except EstoqueNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item de estoque não encontrado") from exc
    return EstoqueResponseSchema.model_validate(item)


@router.post("")
def create_estoque_item(payload: EstoqueCreateSchema, _current_user: dict = Depends(verify_cargo(1, 3)), db: Session = Depends(get_db)):
    item = create_estoque(db, payload)
    return EstoqueResponseSchema.model_validate(item)


@router.put("/{estoque_id}")
def update_estoque_item(estoque_id: int, payload: EstoqueUpdateSchema, _current_user: dict = Depends(verify_cargo(1, 3)), db: Session = Depends(get_db)):
    try:
        item = update_estoque(db, estoque_id, payload)
    except EstoqueNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item de estoque não encontrado") from exc
    except EstoqueHasDependenciesError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Não foi possível atualizar o item de estoque") from exc
    return EstoqueResponseSchema.model_validate(item)


@router.delete("/{estoque_id}")
def delete_estoque_item(estoque_id: int, _current_user: dict = Depends(verify_cargo(1, 3)), db: Session = Depends(get_db)):
    try:
        delete_estoque(db, estoque_id)
    except EstoqueNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item de estoque não encontrado") from exc
    except EstoqueHasDependenciesError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Não é possível excluir um item de estoque que possui pedidos vinculados") from exc

    return {"detail": "Item de estoque excluído com sucesso"}
