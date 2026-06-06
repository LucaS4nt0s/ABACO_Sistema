from pydantic import BaseModel, ConfigDict, Field


class EstoqueCreateSchema(BaseModel):
    nomeItem: str
    quantidadeDisponivel: int | None = None
    unidade: str | None = None


class EstoqueUpdateSchema(BaseModel):
    nomeItem: str | None = None
    quantidadeDisponivel: int | None = None
    unidade: str | None = None


class EstoqueResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id_item_estoque: int = Field(alias="idItemEstoque")
    nome_item: str | None = Field(None, alias="nomeItem")
    quantidade_disponivel: int | None = Field(None, alias="quantidadeDisponivel")
    unidade: str | None = None
