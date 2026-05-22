from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    senha: str = Field(min_length=1)


class UsuarioResponse(BaseModel):
    idUsuario: int
    nome: str | None
    email: EmailStr
    cargo: int | None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioResponse