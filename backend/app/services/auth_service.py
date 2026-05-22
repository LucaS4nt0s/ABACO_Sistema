from sqlalchemy.orm import Session

from app.core.security import create_access_token, verify_password
from app.models.usuario import Usuario


class InvalidCredentialsError(Exception):
    pass


def authenticate_user(db: Session, email: str, senha: str) -> Usuario:
    usuario = db.query(Usuario).filter(Usuario.email == email).first()

    if not usuario or not usuario.senha_hash:
        raise InvalidCredentialsError

    if not verify_password(senha, usuario.senha_hash):
        raise InvalidCredentialsError

    return usuario


def build_login_response(usuario: Usuario) -> dict:
    token = create_access_token(subject=str(usuario.id_usuario), cargo=int(usuario.cargo or 0))
    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": {
            "idUsuario": usuario.id_usuario,
            "nome": usuario.nome,
            "email": usuario.email,
            "cargo": usuario.cargo,
        },
    }