from fastapi import Header, HTTPException, status
import jwt

from app.core.config import get_settings


def _extract_token(authorization: str | None) -> str:
	if not authorization:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token ausente")

	parts = authorization.split()
	if len(parts) == 2 and parts[0].lower() == "bearer":
		return parts[1]

	return authorization


def decode_access_token(token: str) -> dict:
	settings = get_settings()
	try:
		return jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
	except jwt.PyJWTError as exc:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido") from exc


def verify_director_role(authorization: str | None = Header(default=None)) -> dict:
	token = _extract_token(authorization)
	payload = decode_access_token(token)
	if int(payload.get("cargo", 0) or 0) != 1:
		raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acesso restrito à diretoria")
	return payload