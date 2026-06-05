from fastapi import Depends, Header, HTTPException, status
import jwt

from app.core.config import get_settings


AUTH_ERROR_HEADERS = {"WWW-Authenticate": "Bearer"}


def _extract_token(authorization: str | None) -> str:
	if not authorization:
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="Token ausente",
			headers=AUTH_ERROR_HEADERS,
		)

	parts = authorization.split()
	if len(parts) == 2 and parts[0].lower() == "bearer":
		return parts[1]

	raise HTTPException(
		status_code=status.HTTP_401_UNAUTHORIZED,
		detail="Formato de token inválido",
		headers=AUTH_ERROR_HEADERS,
	)


def decode_access_token(token: str) -> dict:
	settings = get_settings()
	try:
		return jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
	except jwt.ExpiredSignatureError:
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="Token expirado",
			headers=AUTH_ERROR_HEADERS,
		)
	except jwt.PyJWTError as exc:
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="Token inválido",
			headers=AUTH_ERROR_HEADERS,
		) from exc


def get_current_user(authorization: str | None = Header(default=None)) -> dict:
	token = _extract_token(authorization)
	return decode_access_token(token)


def verify_director_role(current_user: dict = Depends(get_current_user)) -> dict:
	if int(current_user.get("cargo", 0) or 0) != 1:
		raise HTTPException(
			status_code=status.HTTP_403_FORBIDDEN,
			detail="Acesso restrito à diretoria",
		)
	return current_user


def verify_admin_role(current_user: dict = Depends(get_current_user)) -> dict:
	cargo = int(current_user.get("cargo", 0) or 0)
	if cargo not in (1, 3):
		raise HTTPException(
			status_code=status.HTTP_403_FORBIDDEN,
			detail="Acesso restrito à administração",
		)
	return current_user