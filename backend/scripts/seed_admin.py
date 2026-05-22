from __future__ import annotations

import argparse
import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from sqlalchemy import select

from app.core.config import get_settings
from app.core.security import hash_password
from app.db.database import SessionLocal
from app.models.usuario import Usuario


DEFAULT_NAME = "Admin ABACO"
DEFAULT_EMAIL = get_settings().admin_seed_email
DEFAULT_PHONE = "11999999999"
DEFAULT_PASSWORD = get_settings().admin_seed_password
DEFAULT_CARGO = 3


def normalize_text(value: str | None) -> str | None:
    if value is None:
        return None

    cleaned = value.strip()
    if len(cleaned) >= 2 and cleaned[0] == cleaned[-1] and cleaned[0] in {'"', "'"}:
        return cleaned[1:-1]
    return cleaned


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Cria ou atualiza o usuário administrador do ABACO.")
    parser.add_argument("--nome", default=DEFAULT_NAME, help="Nome do usuário admin.")
    parser.add_argument("--email", default=DEFAULT_EMAIL, help="E-mail do usuário admin. Usa ADMIN_SEED_EMAIL do .env se não informado.")
    parser.add_argument("--telefone", default=DEFAULT_PHONE, help="Telefone do usuário admin.")
    parser.add_argument("--senha", default=DEFAULT_PASSWORD, help="Senha em texto puro para gerar o hash. Usa ADMIN_SEED_PASSWORD do .env se não informado.")
    parser.add_argument("--hash", dest="hash_value", default=None, help="Use uma hash bcrypt pré-gerada em vez de gerar uma nova.")
    parser.add_argument("--cargo", type=int, default=DEFAULT_CARGO, help="Cargo numérico do usuário admin.")
    return parser


def seed_admin(nome: str, email: str, telefone: str, senha: str, cargo: int, hash_value: str | None = None) -> tuple[str, bool]:
    db = SessionLocal()
    try:
        nome = normalize_text(nome) or nome
        email = normalize_text(email) or email
        telefone = normalize_text(telefone) or telefone
        senha = normalize_text(senha) or senha
        hash_value = normalize_text(hash_value)

        if not email:
            raise ValueError("Defina ADMIN_SEED_EMAIL no .env ou informe --email.")

        if not senha and not hash_value:
            raise ValueError("Defina ADMIN_SEED_PASSWORD no .env ou informe --senha/--hash.")

        usuario = db.execute(select(Usuario).where(Usuario.email == email)).scalar_one_or_none()
        senha_hash = hash_value or hash_password(senha)

        created = usuario is None
        if created:
            usuario = Usuario(
                nome=nome,
                email=email,
                telefone=telefone,
                senha_hash=senha_hash,
                cargo=cargo,
            )
            db.add(usuario)
        else:
            usuario.nome = nome
            usuario.telefone = telefone
            usuario.senha_hash = senha_hash
            usuario.cargo = cargo

        db.commit()
        db.refresh(usuario)
        return usuario.email or email, created
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    email, created = seed_admin(
        nome=args.nome,
        email=args.email,
        telefone=args.telefone,
        senha=args.senha,
        hash_value=args.hash_value,
        cargo=args.cargo,
    )

    action = "criado" if created else "atualizado"
    print(f"Usuário admin {action} com sucesso: {email}")


if __name__ == "__main__":
    main()