from pydantic import BaseModel, EmailStr, Field, model_validator


class LoginRequest(BaseModel):
    email: EmailStr
    senha: str = Field(min_length=1)


class RegisterRequest(BaseModel):
    nome: str = Field(min_length=1)
    email: EmailStr
    telefone: str | None = None
    senha: str = Field(min_length=8)
    confirmar_senha: str = Field(min_length=8)

    @model_validator(mode="after")
    def check_passwords_match(self):
        if self.senha != self.confirmar_senha:
            raise ValueError("As senhas não conferem")
        return self


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str = Field(min_length=1)
    nova_senha: str = Field(min_length=8)
    confirmar_senha: str = Field(min_length=8)

    @model_validator(mode="after")
    def check_passwords_match(self):
        if self.nova_senha != self.confirmar_senha:
            raise ValueError("As senhas não conferem")
        return self


class UsuarioResponse(BaseModel):
    idUsuario: int
    nome: str | None
    email: EmailStr
    cargo: int | None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioResponse


class MessageResponse(BaseModel):
    message: str