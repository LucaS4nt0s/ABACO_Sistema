from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.auth_schema import LoginRequest, TokenResponse, UsuarioResponse
from app.services.auth_service import InvalidCredentialsError, authenticate_user, build_login_response

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    try:
        usuario = authenticate_user(db, payload.email, payload.senha)
    except InvalidCredentialsError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="E-mail ou senha incorretos")

    response = build_login_response(usuario)
    response["usuario"] = UsuarioResponse(**response["usuario"])
    return response