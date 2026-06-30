# DIAGRAMA DE CLASSE UML — SGA ABACO

**Arquitetura em 5 camadas + Núcleo: Model, Schema, Controlador, Servico, Visão**

Baseado no código real em `backend/app/` (Python/FastAPI) e `frontend/src/app/` (Angular).

**Legenda:**
- `-` privado | `#` protegido | `+` público
- `?` = nullable/optional
- `PK` = Primary Key | `FK` = Foreign Key
- `alias` = nome serializado na API (camelCase)

---

## CAMADA 1 — MODEL (Entidades SQLAlchemy)

### Pacote: `backend/app/models/`

Tabelas do banco PostgreSQL mapeadas via SQLAlchemy ORM.

---

### Classe: Aluno
Tabela: `aluno`
```
+------------------------------------------------------------+
| <<Entity>> Aluno                                           |
+------------------------------------------------------------+
| - id_aluno: int (PK, column: idaluno)                      |
| - nome: str (NOT NULL)                                     |
| - telefone: str ?                                           |
| - data_nascimento: date ? (column: nascimento)             |
| - rua: str ?                                                |
| - bairro: str ?                                             |
| - numero: int ?                                             |
+------------------------------------------------------------+
| + get_id_aluno() : int                                      |
| + set_id_aluno(id: int) : void                              |
| + get_nome() : str                                          |
| + set_nome(nome: str) : void                                |
| + get_telefone() : str?                                     |
| + set_telefone(telefone: str?) : void                      |
| + get_data_nascimento() : date?                             |
| + set_data_nascimento(data: date?) : void                  |
| + get_rua() : str?                                          |
| + set_rua(rua: str?) : void                                |
| + get_bairro() : str?                                       |
| + set_bairro(bairro: str?) : void                          |
| + get_numero() : int?                                       |
| + set_numero(numero: int?) : void                          |
+------------------------------------------------------------+
| Relacionamentos:                                            |
| + matriculas: list[Matricula] (1 --- *)                    |
+------------------------------------------------------------+
```

---

### Classe: Curso
Tabela: `curso`
```
+------------------------------------------------------------+
| <<Entity>> Curso                                           |
+------------------------------------------------------------+
| - id_curso: int (PK, column: idcurso)                      |
| - nome_curso: str (NOT NULL, column: nomecurso)            |
+------------------------------------------------------------+
| + get_id_curso() : int                                      |
| + set_id_curso(id: int) : void                              |
| + get_nome_curso() : str                                    |
| + set_nome_curso(nome: str) : void                          |
+------------------------------------------------------------+
```

---

### Classe: Turma
Tabela: `turma`
```
+------------------------------------------------------------+
| <<Entity>> Turma                                           |
+------------------------------------------------------------+
| - id_turma: int (PK, column: idturma)                      |
| - capacidade: int ?                                         |
| - data_inicio: date ? (column: datainicio)                 |
| - data_fim: date ? (column: datafim)                       |
| - id_curso: int (FK -> curso.idcurso)                      |
| - id_professor: int ? (FK -> usuario.idusuario)            |
| - dias_aula: str ? (column: diasaula)                      |
| - avaliacoes: list ? (JSONB)                               |
| + vagas_ocupadas: int (readonly, calculado)                |
+------------------------------------------------------------+
| + get_id_turma() : int                                      |
| + set_id_turma(id: int) : void                              |
| + get_capacidade() : int?                                   |
| + set_capacidade(capacidade: int?) : void                  |
| + get_data_inicio() : date?                                 |
| + set_data_inicio(data: date?) : void                      |
| + get_data_fim() : date?                                    |
| + set_data_fim(data: date?) : void                         |
| + get_id_curso() : int                                      |
| + set_id_curso(id: int) : void                              |
| + get_id_professor() : int?                                 |
| + set_id_professor(id: int?) : void                        |
| + get_dias_aula() : str?                                    |
| + set_dias_aula(dias: str?) : void                         |
| + get_avaliacoes() : list?                                  |
| + set_avaliacoes(avaliacoes: list?) : void                 |
| + get_vagas_ocupadas() : int                                |
+------------------------------------------------------------+
| Relacionamentos:                                            |
| + curso: Curso (* --- 1)                                   |
| + professor: Usuario (* --- 0..1)                          |
| + matriculas: list[Matricula] (1 --- *)                    |
+------------------------------------------------------------+
```

---

### Classe: Matricula
Tabela: `matricula`
```
+------------------------------------------------------------+
| <<Entity>> Matricula                                       |
+------------------------------------------------------------+
| - id_matricula: int (PK, column: idmatricula)              |
| - id_aluno: int (FK -> aluno.idaluno)                      |
| - id_turma: int (FK -> turma.idturma)                      |
| - data_matricula: date ? (column: datamatricula)           |
| - status: int ? (0=Ativa, 1=Concluída, 2=Cancelada)       |
+------------------------------------------------------------+
| + get_id_matricula() : int                                  |
| + set_id_matricula(id: int) : void                          |
| + get_id_aluno() : int                                      |
| + set_id_aluno(id: int) : void                              |
| + get_id_turma() : int                                      |
| + set_id_turma(id: int) : void                              |
| + get_data_matricula() : date?                              |
| + set_data_matricula(data: date?) : void                   |
| + get_status() : int?                                       |
| + set_status(status: int?) : void                          |
+------------------------------------------------------------+
| Relacionamentos:                                            |
| + aluno: Aluno (* --- 1) (lazy=joined)                     |
| + turma: Turma (* --- 1) (lazy=joined)                     |
+------------------------------------------------------------+
```

---

### Classe: Nota
Tabela: `nota`
```
+------------------------------------------------------------+
| <<Entity>> Nota                                            |
+------------------------------------------------------------+
| - id_nota: int (PK, column: idnota)                        |
| - nota: float ?                                             |
| - prova: int ?                                              |
| - id_matricula: int (FK -> matricula.idmatricula)          |
+------------------------------------------------------------+
| + get_id_nota() : int                                       |
| + set_id_nota(id: int) : void                               |
| + get_nota() : float?                                       |
| + set_nota(nota: float?) : void                            |
| + get_prova() : int?                                        |
| + set_prova(prova: int?) : void                            |
| + get_id_matricula() : int                                  |
| + set_id_matricula(id: int) : void                          |
+------------------------------------------------------------+
| Relacionamentos:                                            |
| + matricula: Matricula (* --- 1) (lazy=joined)             |
+------------------------------------------------------------+
```

---

### Classe: Presenca
Tabela: `presenca`
```
+------------------------------------------------------------+
| <<Entity>> Presenca                                        |
+------------------------------------------------------------+
| - id_presenca: int (PK, column: idpresenca)                |
| - id_matricula: int (FK -> matricula.idmatricula)          |
| - data_aula: date ? (column: dataaula)                     |
| - presente: bool ?                                          |
+------------------------------------------------------------+
| + get_id_presenca() : int                                   |
| + set_id_presenca(id: int) : void                           |
| + get_id_matricula() : int                                  |
| + set_id_matricula(id: int) : void                          |
| + get_data_aula() : date?                                   |
| + set_data_aula(data: date?) : void                        |
| + get_presente() : bool?                                    |
| + set_presente(presente: bool?) : void                     |
+------------------------------------------------------------+
| Relacionamentos:                                            |
| + matricula: Matricula (* --- 1) (lazy=joined)             |
+------------------------------------------------------------+
```

---

### Classe: Usuario
Tabela: `usuario`
```
+------------------------------------------------------------+
| <<Entity>> Usuario                                         |
+------------------------------------------------------------+
| - id_usuario: int (PK, column: idusuario)                  |
| - nome: str ?                                               |
| - telefone: str ?                                           |
| - email: str ? (UNIQUE, indexed)                            |
| - senha_hash: str ? (column: senhahash)                    |
| - cargo: int ? (1=Diretor, 2=Professor, 3=Admin)          |
+------------------------------------------------------------+
| + get_id_usuario() : int                                    |
| + set_id_usuario(id: int) : void                            |
| + get_nome() : str?                                         |
| + set_nome(nome: str?) : void                              |
| + get_telefone() : str?                                     |
| + set_telefone(telefone: str?) : void                      |
| + get_email() : str?                                        |
| + set_email(email: str?) : void                            |
| + get_senha_hash() : str?                                   |
| + set_senha_hash(hash: str?) : void                        |
| + get_cargo() : int?                                        |
| + set_cargo(cargo: int?) : void                            |
+------------------------------------------------------------+
```

---

### Classe: Pedido
Tabela: `pedido`
```
+------------------------------------------------------------+
| <<Entity>> Pedido                                          |
+------------------------------------------------------------+
| - id_pedido: int (PK, column: idpedido)                    |
| - id_usuario: int (FK -> usuario.idusuario)                |
| - id_turma: int (FK -> turma.idturma)                      |
| - data_pedido: date ? (column: datapedido)                 |
| - status: int ? (0=Solicitado, 1=Aprovado, 2=Comprado,    |
|              3=Entregue)                                   |
+------------------------------------------------------------+
| + get_id_pedido() : int                                     |
| + set_id_pedido(id: int) : void                             |
| + get_id_usuario() : int                                    |
| + set_id_usuario(id: int) : void                            |
| + get_id_turma() : int                                      |
| + set_id_turma(id: int) : void                              |
| + get_data_pedido() : date?                                 |
| + set_data_pedido(data: date?) : void                      |
| + get_status() : int?                                       |
| + set_status(status: int?) : void                          |
+------------------------------------------------------------+
| Relacionamentos:                                            |
| + usuario: Usuario (* --- 1) (lazy=joined)                 |
| + turma: Turma (* --- 1) (lazy=joined)                     |
| + itens: list[ItemPedido] (1 --- *) (lazy=joined)          |
+------------------------------------------------------------+
```

---

### Classe: ItemPedido
Tabela: `itempedido`
```
+------------------------------------------------------------+
| <<Entity>> ItemPedido                                      |
+------------------------------------------------------------+
| - id_item_pedido: int (PK, column: iditempedido)           |
| - id_pedido: int (FK -> pedido.idpedido)                   |
| - id_item_estoque: int ? (FK -> estoque.iditemestoque)    |
| - nome_item: str ? (column: nomeitem)                      |
| - quantidade: int ?                                         |
| - preco_unitario: float ? (column: precounitario)          |
+------------------------------------------------------------+
| + get_id_item_pedido() : int                                |
| + set_id_item_pedido(id: int) : void                        |
| + get_id_pedido() : int                                     |
| + set_id_pedido(id: int) : void                             |
| + get_id_item_estoque() : int?                              |
| + set_id_item_estoque(id: int?) : void                     |
| + get_nome_item() : str?                                    |
| + set_nome_item(nome: str?) : void                         |
| + get_quantidade() : int?                                   |
| + set_quantidade(qtd: int?) : void                         |
| + get_preco_unitario() : float?                             |
| + set_preco_unitario(preco: float?) : void                 |
+------------------------------------------------------------+
| Relacionamentos:                                            |
| + item_estoque: Estoque (* --- 0..1) (lazy=joined)        |
+------------------------------------------------------------+
```

---

### Classe: Estoque
Tabela: `estoque`
```
+------------------------------------------------------------+
| <<Entity>> Estoque                                         |
+------------------------------------------------------------+
| - id_item_estoque: int (PK, column: iditemestoque)         |
| - nome_item: str ? (column: nomeitem)                      |
| - quantidade_disponivel: int ? (column: quantidadedisponivel)|
| - unidade: str ?                                            |
| - estoque_minimo: int ? (column: estoqueminimo)            |
+------------------------------------------------------------+
| + get_id_item_estoque() : int                               |
| + set_id_item_estoque(id: int) : void                       |
| + get_nome_item() : str?                                    |
| + set_nome_item(nome: str?) : void                         |
| + get_quantidade_disponivel() : int?                        |
| + set_quantidade_disponivel(qtd: int?) : void              |
| + get_unidade() : str?                                      |
| + set_unidade(unidade: str?) : void                        |
| + get_estoque_minimo() : int?                               |
| + set_estoque_minimo(min: int?) : void                     |
+------------------------------------------------------------+
```

---

### Classe: MovimentacaoEstoque
Tabela: `movimentacao_estoque`
```
+------------------------------------------------------------+
| <<Entity>> MovimentacaoEstoque                             |
+------------------------------------------------------------+
| - id_movimentacao: int (PK, column: idmovimentacao)        |
| - id_item_estoque: int (FK -> estoque.iditemestoque)       |
| - quantidade: int                                           |
| - tipo_movimentacao: str (column: tipomovimentacao)        |
|   ("pedido_aprovado" | "baixa_manual")                     |
| - justificativa: str ?                                      |
| - data_movimentacao: datetime (column: datamovimentacao)   |
+------------------------------------------------------------+
| + get_id_movimentacao() : int                               |
| + set_id_movimentacao(id: int) : void                       |
| + get_id_item_estoque() : int                               |
| + set_id_item_estoque(id: int) : void                       |
| + get_quantidade() : int                                    |
| + set_quantidade(qtd: int) : void                           |
| + get_tipo_movimentacao() : str                             |
| + set_tipo_movimentacao(tipo: str) : void                  |
| + get_justificativa() : str?                                |
| + set_justificativa(just: str?) : void                     |
| + get_data_movimentacao() : datetime                        |
| + set_data_movimentacao(data: datetime) : void             |
+------------------------------------------------------------+
```

### Relacionamentos entre Entidades

```
Aluno        1 --- * Matricula        (via id_aluno)
Curso        1 --- * Turma            (via id_curso)
Turma        1 --- * Matricula        (via id_turma)
Turma        * --- 0..1 Usuario       (via id_professor, cargo=professor)
Turma        1 --- * Pedido           (via id_turma)
Matricula    1 --- * Nota             (via id_matricula)
Matricula    1 --- * Presenca         (via id_matricula)
Usuario      1 --- * Pedido           (via id_usuario, solicitante)
Pedido       1 --- * ItemPedido       (via id_pedido)
ItemPedido   * --- 0..1 Estoque       (via id_item_estoque)
Estoque      1 --- * MovimentacaoEstoque (via id_item_estoque)
```

---

## CAMADA 2 — SCHEMA (Pydantic DTOs)

### Pacote: `backend/app/schemas/`

Os schemas validam a entrada (Create/Update) e serializam a saída (Response) da API.
Utilizam `from_attributes=True` para converter ORM -> dict.
Aliases nos nomes dos campos para serializar em camelCase na API.

---

### Aluno
| Schema | Tipo | Campos |
|--------|------|--------|
| `AlunoCreateSchema` | Create | `nome: str`, `telefone?`, `dataNascimento?`, `rua?`, `bairro?`, `numero?` |
| `AlunoUpdateSchema` | Update | `nome: str`, `telefone?`, `dataNascimento?`, `rua?`, `bairro?`, `numero?` |
| `AlunoResponseSchema` | Response | `idAluno: int`, `nome: str`, `telefone?`, `dataNascimento?`, `rua?`, `bairro?`, `numero?` |

### Curso
| Schema | Campos |
|--------|--------|
| `CursoCreateSchema` | `nomeCurso: str` |
| `CursoUpdateSchema` | `nomeCurso: str` |
| `CursoResponseSchema` | `idCurso: int`, `nomeCurso: str` |

### Turma
| Schema | Campos |
|--------|--------|
| `TurmaCreateSchema` | `capacidade?`, `dataInicio?`, `dataFim?`, `idCurso: int`, `idProfessor?`, `diasAula?`, `avaliacoes?` |
| `TurmaUpdateSchema` | Todos opcionais |
| `TurmaResponseSchema` | `idTurma: int`, `capacidade?`, `dataInicio?`, `dataFim?`, `idCurso: int`, `idProfessor?`, `diasAula?`, `vagasOcupadas?`, `avaliacoes?`, `curso: TurmaCursoInfo?`, `professor: TurmaProfessorInfo?` |

### Matricula
| Schema | Campos |
|--------|--------|
| `MatriculaCreateSchema` | `idAluno: int`, `idTurma: int`, `dataMatricula?`, `status?` |
| `MatriculaUpdateSchema` | Todos opcionais |
| `MatriculaResponseSchema` | `idMatricula: int`, `idAluno?`, `idTurma?`, `dataMatricula?`, `status?`, `aluno: MatriculaAlunoInfo?`, `turma: MatriculaTurmaInfo?` |

### Nota
| Schema | Campos |
|--------|--------|
| `NotaItemSchema` | `idMatricula: int`, `nota: float?` |
| `NotaBatchSchema` | `idTurma: int`, `prova: int`, `notas: list[NotaItemSchema]` |
| `NotaResponseSchema` | `idNota: int`, `idMatricula: int`, `nota?`, `prova?`, `matricula: NotaMatriculaInfo?` |
| `MediaProvaSchema` | `prova: int`, `media: float?` |
| `MediaTurmaSchema` | `idTurma: int`, `medias: list[MediaProvaSchema]` |

### Presenca
| Schema | Campos |
|--------|--------|
| `PresencaItemSchema` | `idMatricula: int`, `presente: bool` |
| `PresencaBatchSchema` | `idTurma: int`, `dataAula: date`, `presencas: list[PresencaItemSchema]` |
| `PresencaResponseSchema` | `idPresenca: int`, `idMatricula: int`, `dataAula?`, `presente?`, `matricula: PresencaMatriculaInfo?` |

### Usuario
| Schema | Campos |
|--------|--------|
| `UsuarioCreateSchema` | `nome: str`, `email: EmailStr`, `senha: str`, `cargo: int (1-3)`, `telefone?` |
| `UsuarioUpdateSchema` | `nome: str`, `telefone?`, `cargo: int (1-3)` |
| `UsuarioResponseSchema` | `idUsuario: int`, `nome?`, `telefone?`, `email?`, `cargo?` |

### Pedido
| Schema | Campos |
|--------|--------|
| `PedidoCreateSchema` | `idTurma: int`, `dataPedido?`, `itens: list[ItemPedidoCreateSchema]` |
| `PedidoUpdateSchema` | `status: int` |
| `PedidoCompraSchema` | `itens: list[ItemPedidoCompraSchema]` |
| `PedidoResponseSchema` | `idPedido: int`, `idUsuario: int`, `idTurma: int`, `dataPedido?`, `status?`, `usuario: UsuarioPedidoInfo?`, `turma: TurmaPedidoInfo?`, `itens: list[ItemPedidoResponseSchema]?` |

### Estoque
| Schema | Campos |
|--------|--------|
| `EstoqueCreateSchema` | `nomeItem: str`, `quantidadeDisponivel?`, `unidade?`, `estoqueMinimo?` |
| `EstoqueUpdateSchema` | Todos opcionais |
| `EstoqueBaixaSchema` | `quantidade: int (gt=0)`, `justificativa: str` |
| `EstoqueResponseSchema` | `idItemEstoque: int`, `nomeItem?`, `quantidadeDisponivel?`, `unidade?`, `estoqueMinimo?` |
| `EstoqueAlertaResponseSchema` | (mesmo que Response) |

### Auth
| Schema | Campos |
|--------|--------|
| `LoginRequest` | `email: EmailStr`, `senha: str` |
| `ForgotPasswordRequest` | `email: EmailStr` |
| `ResetPasswordRequest` | `token: str`, `nova_senha: str`, `confirmar_senha: str` |
| `TokenResponse` | `access_token: str`, `token_type: str = "bearer"`, `usuario: UsuarioResponse` |
| `MessageResponse` | `message: str` |

### Dashboard
| Schema | Campos |
|--------|--------|
| `KpisResponse` | `total_alunos_ativos: int`, `total_turmas_vigentes: int`, `total_pedidos_pendentes: int`, `total_estoque_critico: int` |
| `ChartAcademicoResponse` | `alunos_por_curso: list[AlunosPorCurso]`, `status_matriculas: list[StatusMatriculas]` |
| `ChartLogisticaResponse` | `consumo_mes_atual: list[ConsumoItem]` |

### Historico
| Schema | Campos |
|--------|--------|
| `HistoricoResponse` | `idMatricula: int`, `dataMatricula?`, `status?`, `aluno: HistoricoAlunoInfo`, `turma: HistoricoTurmaInfo`, `notas: list[HistoricoNotaInfo]`, `presencas: list[HistoricoPresencaInfo]`, `percentualFrequencia: float?` |

---

## CAMADA 3 — CONTROLADOR (FastAPI Routers)

### Pacote: `backend/app/api/v1/`

Cada controlador é um `APIRouter` do FastAPI com prefixo e tags.

---

### ControladorAuth
```
+------------------------------------------------------------+
| <<Controller>> ControladorAuth | prefixo: /api/v1/auth     |
+------------------------------------------------------------+
| + POST /api/v1/auth/login(payload: LoginRequest)           |
|   -> TokenResponse (rate limit: 5/min)                     |
| + POST /api/v1/auth/forgot-password(                       |
|     payload: ForgotPasswordRequest) -> MessageResponse      |
|   (rate limit: 3/min)                                      |
| + POST /api/v1/auth/reset-password(                        |
|     payload: ResetPasswordRequest) -> MessageResponse      |
|   (rate limit: 5/min)                                      |
+------------------------------------------------------------+
| Depende de: ServicoAuth, ServicoEmail, Limitador           |
+------------------------------------------------------------+
```

### ControladorAluno
```
+------------------------------------------------------------+
| <<Controller>> ControladorAluno | prefixo: /api/v1/alunos  |
| Acesso: cargo 1, 2, 3                                      |
+------------------------------------------------------------+
| + GET /api/v1/alunos() -> list[AlunoResponseSchema]        |
| + GET /api/v1/alunos/{aluno_id}() -> AlunoResponseSchema   |
| + POST /api/v1/alunos(payload: AlunoCreateSchema)          |
|   -> AlunoResponseSchema                                   |
| + PUT /api/v1/alunos/{aluno_id}(payload: AlunoUpdateSchema)|
|   -> AlunoResponseSchema                                   |
| + DELETE /api/v1/alunos/{aluno_id}() -> dict               |
+------------------------------------------------------------+
| Depende de: ServicoAluno                                   |
+------------------------------------------------------------+
```

### ControladorCurso
```
+------------------------------------------------------------+
| <<Controller>> ControladorCurso | prefixo: /api/v1/cursos  |
| Acesso: cargo 1, 2, 3                                      |
+------------------------------------------------------------+
| + GET /api/v1/cursos() -> list[CursoResponseSchema]        |
| + GET /api/v1/cursos/{curso_id}() -> CursoResponseSchema   |
| + POST /api/v1/cursos(payload: CursoCreateSchema)          |
|   -> CursoResponseSchema                                   |
| + PUT /api/v1/cursos/{curso_id}(payload: CursoUpdateSchema)|
|   -> CursoResponseSchema                                   |
| + DELETE /api/v1/cursos/{curso_id}() -> dict               |
+------------------------------------------------------------+
| Depende de: ServicoCurso                                   |
+------------------------------------------------------------+
```

### ControladorTurma
```
+------------------------------------------------------------+
| <<Controller>> ControladorTurma | prefixo: /api/v1/turmas  |
| Acesso: cargo 1, 2, 3                                      |
+------------------------------------------------------------+
| + GET /api/v1/turmas() -> list[TurmaResponseSchema]        |
| + GET /api/v1/turmas/me() -> list[TurmaResponseSchema]    |
|   (filtra por professor logado, cargo 1-2)                 |
| + GET /api/v1/turmas/{turma_id}() -> TurmaResponseSchema   |
| + POST /api/v1/turmas(payload: TurmaCreateSchema)          |
|   -> TurmaResponseSchema                                   |
| + PUT /api/v1/turmas/{turma_id}(payload: TurmaUpdateSchema)|
|   -> TurmaResponseSchema                                   |
| + DELETE /api/v1/turmas/{turma_id}() -> dict               |
+------------------------------------------------------------+
| Depende de: ServicoTurma                                   |
+------------------------------------------------------------+
```

### ControladorMatricula
```
+------------------------------------------------------------+
| <<Controller>> ControladorMatricula                        |
| prefixo: /api/v1/matriculas | Acesso: cargo 1, 2, 3       |
+------------------------------------------------------------+
| + GET /api/v1/matriculas() -> list[MatriculaResponseSchema]|
| + GET /api/v1/matriculas/me() -> list[MatriculaResponseSchema]|
| + GET /api/v1/matriculas/{matricula_id}()                  |
|   -> MatriculaResponseSchema                               |
| + POST /api/v1/matriculas(payload: MatriculaCreateSchema)  |
|   -> MatriculaResponseSchema                               |
| + PUT /api/v1/matriculas/{matricula_id}(                   |
|     payload: MatriculaUpdateSchema) -> MatriculaResponseSchema|
| + DELETE /api/v1/matriculas/{matricula_id}() -> dict       |
+------------------------------------------------------------+
| Depende de: ServicoMatricula                               |
+------------------------------------------------------------+
```

### ControladorNota
```
+------------------------------------------------------------+
| <<Controller>> ControladorNota | prefixo: /api/v1/notas    |
| Acesso: cargo 1, 2, 3                                      |
+------------------------------------------------------------+
| + POST /api/v1/notas(payload: NotaBatchSchema)             |
|   -> list[NotaResponseSchema] (upsert)                     |
| + GET /api/v1/notas/matricula/{matricula_id}()             |
|   -> list[NotaResponseSchema]                              |
| + GET /api/v1/notas/turma/{turma_id}(prova?: int)          |
|   -> list[NotaResponseSchema]                              |
| + GET /api/v1/notas/media/turma/{turma_id}()               |
|   -> MediaTurmaSchema                                      |
+------------------------------------------------------------+
| Depende de: ServicoNota                                    |
+------------------------------------------------------------+
```

### ControladorPresenca
```
+------------------------------------------------------------+
| <<Controller>> ControladorPresenca                         |
| prefixo: /api/v1/presencas | Acesso: cargo 1, 2, 3        |
+------------------------------------------------------------+
| + POST /api/v1/presencas(payload: PresencaBatchSchema)     |
|   -> list[PresencaResponseSchema] (upsert)                 |
| + GET /api/v1/presencas/turma/{turma_id}(dataAula?: date) |
|   -> list[PresencaResponseSchema]                           |
+------------------------------------------------------------+
| Depende de: ServicoPresenca                                |
+------------------------------------------------------------+
```

### ControladorUsuario
```
+------------------------------------------------------------+
| <<Controller>> ControladorUsuario                          |
| prefixo: /api/v1/usuarios | Acesso: cargo 1 (DIRETOR)     |
+------------------------------------------------------------+
| + GET /api/v1/usuarios() -> list[UsuarioResponseSchema]    |
| + GET /api/v1/usuarios/{usuario_id}() -> UsuarioResponseSchema|
| + POST /api/v1/usuarios(payload: UsuarioCreateSchema)      |
|   -> UsuarioResponseSchema                                 |
| + PUT /api/v1/usuarios/{usuario_id}(                       |
|     payload: UsuarioUpdateSchema) -> UsuarioResponseSchema  |
| + DELETE /api/v1/usuarios/{usuario_id}() -> dict           |
|   (impede auto-exclusão)                                    |
+------------------------------------------------------------+
| Depende de: ServicoUsuario                                 |
+------------------------------------------------------------+
```

### ControladorPedido
```
+------------------------------------------------------------+
| <<Controller>> ControladorPedido                           |
| prefixo: /api/v1/pedidos | Acesso: cargo 1, 2, 3          |
+------------------------------------------------------------+
| Acesso 1,2,3:                                              |
| + GET /api/v1/pedidos() -> list[PedidoResponseSchema]      |
| + GET /api/v1/pedidos/{pedido_id}() -> PedidoResponseSchema|
| + POST /api/v1/pedidos(payload: PedidoCreateSchema)        |
|   -> PedidoResponseSchema                                  |
| + DELETE /api/v1/pedidos/{pedido_id}() -> dict             |
| Acesso 1 (DIRETOR):                                        |
| + PUT /api/v1/pedidos/{pedido_id}/aprovar()                |
|   -> PedidoResponseSchema (status 0->1)                    |
| + PUT /api/v1/pedidos/{pedido_id}/comprar(                 |
|     payload: PedidoCompraSchema) -> PedidoResponseSchema   |
|   (status 1->2)                                            |
| + PUT /api/v1/pedidos/{pedido_id}(                         |
|     payload: PedidoUpdateSchema) -> PedidoResponseSchema   |
| + PUT /api/v1/pedidos/{pedido_id}/entregar()               |
|   -> PedidoResponseSchema (status 2->3)                    |
+------------------------------------------------------------+
| Depende de: ServicoPedido, ServicoEstoque                  |
+------------------------------------------------------------+
```

### ControladorEstoque
```
+------------------------------------------------------------+
| <<Controller>> ControladorEstoque                          |
| prefixo: /api/v1/estoque | Acesso: cargo 1, 2, 3          |
+------------------------------------------------------------+
| + GET /api/v1/estoque() -> list[EstoqueResponseSchema]     |
| + GET /api/v1/estoque/search(q: str)                       |
|   -> list[EstoqueResponseSchema]                           |
| + GET /api/v1/estoque/alertas()                            |
|   -> list[EstoqueAlertaResponseSchema]                     |
| + GET /api/v1/estoque/{estoque_id}()                       |
|   -> EstoqueResponseSchema                                 |
| + POST /api/v1/estoque(payload: EstoqueCreateSchema)       |
|   -> EstoqueResponseSchema                                 |
| + PUT /api/v1/estoque/{estoque_id}(                        |
|     payload: EstoqueUpdateSchema) -> EstoqueResponseSchema  |
| + DELETE /api/v1/estoque/{estoque_id}() -> dict            |
| + PUT /api/v1/estoque/{estoque_id}/baixa(                  |
|     payload: EstoqueBaixaSchema) -> EstoqueResponseSchema   |
+------------------------------------------------------------+
| Depende de: ServicoEstoque                                 |
+------------------------------------------------------------+
```

### ControladorDashboard
```
+------------------------------------------------------------+
| <<Controller>> ControladorDashboard                        |
| prefixo: /api/v1/dashboard | Acesso: cargo 1 (DIRETOR)    |
+------------------------------------------------------------+
| + GET /api/v1/dashboard/kpis() -> KpisResponse             |
| + GET /api/v1/dashboard/charts/academico()                 |
|   -> ChartAcademicoResponse                                |
| + GET /api/v1/dashboard/charts/logistica()                 |
|   -> ChartLogisticaResponse                                |
+------------------------------------------------------------+
| Depende de: ServicoDashboard                               |
+------------------------------------------------------------+
```

### ControladorHistorico
```
+------------------------------------------------------------+
| <<Controller>> ControladorHistorico                        |
| prefixo: /api/v1/historico | Acesso: cargo 1, 3           |
+------------------------------------------------------------+
| + GET /api/v1/historico/matricula/{matricula_id}()         |
|   -> HistoricoResponse                                     |
+------------------------------------------------------------+
| Depende de: ServicoHistorico                               |
+------------------------------------------------------------+
```

---

## CAMADA 4 — NÚCLEO (Infraestrutura)

### Pacote: `backend/app/core/` e `backend/app/db/`

### Classe: Configuracao (`core/config.py`)
```
+------------------------------------------------------------+
| <<Configuration>> Configuracao (BaseSettings)              |
+------------------------------------------------------------+
| Atributos de ambiente:                                     |
| + app_name: str = "SGA ABACO API"                         |
| + database_url: str (env: DATABASE_URL)                    |
| + secret_key: str (env: SECRET_KEY ou JWT_SECRET)         |
| + jwt_algorithm: str = "HS256"                             |
| + access_token_expire_minutes: int = 120                   |
| + reset_token_expire_minutes: int = 15                     |
| + smtp_host, smtp_port, smtp_user, smtp_password, smtp_from|
| + frontend_url: str                                        |
| + cors_origins: str                                        |
| + rate_limit_auth: str = "5/minute"                        |
| + rate_limit_default: str = "60/minute"                    |
+------------------------------------------------------------+
| + get_cors_origin_list() : list[str]                       |
+------------------------------------------------------------+
```

### Classe: Seguranca (`core/security.py`)
```
+------------------------------------------------------------+
| <<Utility>> Seguranca                                      |
+------------------------------------------------------------+
| {static} + verify_password(plain: str, hash: str) : bool   |
| {static} + hash_password(password: str) : str              |
| {static} + create_access_token(subject: str, cargo: int,   |
|     expires_delta?: timedelta) : str                       |
| {static} + create_reset_token(email: str,                  |
|     expires_delta?: timedelta) : str                       |
| {static} + decode_reset_token(token: str) : dict           |
+------------------------------------------------------------+
```

### Classe: DependenciasAuth (`core/dependencies.py`)
```
+------------------------------------------------------------+
| <<Utility>> DependenciasAuth                               |
+------------------------------------------------------------+
| {static} + get_current_user(authorization?: str) : dict    |
| {static} + verify_cargo(*cargos_permitidos: int) : callable|
| {static} + verify_director_role() : dict (cargo=1)        |
+------------------------------------------------------------+
```

### Classe: BancoDados (`db/database.py`)
```
+------------------------------------------------------------+
| <<Infrastructure>> BancoDados                              |
+------------------------------------------------------------+
| {static} + engine: Engine (create_engine)                  |
| {static} + SessionLocal: sessionmaker                      |
| {static} + Base: declarative_base                          |
| {static} + get_db() -> Generator[Session]                  |
+------------------------------------------------------------+
```

---

## CAMADA 5 — SERVICO (DAO / Lógica de Negócio)

### Pacote: `backend/app/services/`

Cada serviço contém funções de CRUD + regras de negócio + exceções específicas.
Recebem uma sessão `db: Session` como primeiro parâmetro.

---

### ServicoAuth (`auth_service.py`)
```
+------------------------------------------------------------+
| <<Service>> ServicoAuth                                    |
+------------------------------------------------------------+
| + autenticarUsuario(db, email, senha) : Usuario            |
| + construirRespostaLogin(usuario) : dict                   |
| + processarEsqueciSenha(db, email) : str (token)           |
| + processarRedefinirSenha(db, token, novaSenha,            |
|     confirmarSenha) : void                                 |
+------------------------------------------------------------+
| Exceções: ErroCredenciaisInvalidas,                        |
|   ErroEmailNaoEncontrado, ErroSenhasNaoConferem,           |
|   ErroTokenInvalido                                        |
+------------------------------------------------------------+
```

### ServicoAluno (`aluno_service.py`)
```
+------------------------------------------------------------+
| <<DAO>> ServicoAluno                                       |
+------------------------------------------------------------+
| + criar(db, payload: AlunoCreateSchema) : Aluno            |
| + listar(db) : list[Aluno]                                 |
| + obterPorId(db, aluno_id) : Aluno                         |
| + atualizar(db, aluno_id, payload: AlunoUpdateSchema)      |
|   : Aluno                                                  |
| + excluir(db, aluno_id) : void                             |
+------------------------------------------------------------+
| Exceções: ErroAlunoNaoEncontrado,                          |
|   ErroAlunoPossuiDependencias                              |
+------------------------------------------------------------+
```

### ServicoCurso (`curso_service.py`)
```
+------------------------------------------------------------+
| <<DAO>> ServicoCurso                                       |
+------------------------------------------------------------+
| + criar(db, payload: CursoCreateSchema) : Curso            |
| + listar(db) : list[Curso]                                 |
| + obterPorId(db, curso_id) : Curso                         |
| + atualizar(db, curso_id, payload: CursoUpdateSchema)      |
|   : Curso                                                  |
| + excluir(db, curso_id) : void                             |
+------------------------------------------------------------+
| Exceções: ErroCursoNaoEncontrado,                          |
|   ErroCursoPossuiDependencias                              |
+------------------------------------------------------------+
```

### ServicoTurma (`turma_service.py`)
```
+------------------------------------------------------------+
| <<DAO>> ServicoTurma                                       |
+------------------------------------------------------------+
| # _resolverCurso(db, curso_id) : void                      |
| # _resolverProfessor(db, professor_id) : void              |
| + criar(db, payload: TurmaCreateSchema) : Turma            |
| + listar(db) : list[Turma]                                 |
| + listarPorProfessor(db, prof_id) : list[Turma]            |
| + obterPorId(db, turma_id) : Turma                         |
| + atualizar(db, turma_id, payload: TurmaUpdateSchema)      |
|   : Turma                                                  |
| + excluir(db, turma_id) : void                             |
+------------------------------------------------------------+
| Exceções: ErroTurmaNaoEncontrada,                          |
|   ErroTurmaPossuiDependencias,                             |
|   ErroCursoNaoEncontradoTurma,                             |
|   ErroProfessorNaoEncontradoTurma                          |
+------------------------------------------------------------+
```

### ServicoMatricula (`matricula_service.py`)
```
+------------------------------------------------------------+
| <<DAO>> ServicoMatricula                                   |
+------------------------------------------------------------+
| # _resolverAluno(db, aluno_id) : void                      |
| # _resolverTurma(db, turma_id) : void                      |
| # _verificarTurmaLotada(db, turma_id) : void               |
| # _obterCursoIdPorTurma(db, turma_id) : int                |
| # _verificarMatriculaDuplicada(db, aluno_id, turma_id,    |
|     exclude_id?) : void                                    |
| + criar(db, payload: MatriculaCreateSchema) : Matricula    |
| + listar(db) : list[Matricula]                             |
| + listarPorProfessor(db, prof_id) : list[Matricula]       |
| + obterPorId(db, matricula_id) : Matricula                 |
| + atualizar(db, matricula_id,                              |
|     payload: MatriculaUpdateSchema) : Matricula            |
| + excluir(db, matricula_id) : void                         |
+------------------------------------------------------------+
| Exceções: ErroMatriculaNaoEncontrada,                      |
|   ErroMatriculaPossuiDependencias,                         |
|   ErroAlunoNaoEncontradoMatricula,                         |
|   ErroTurmaNaoEncontradaMatricula,                         |
|   ErroTurmaLotada, ErroMatriculaDuplicada                  |
+------------------------------------------------------------+
```

### ServicoNota (`nota_service.py`)
```
+------------------------------------------------------------+
| <<DAO>> ServicoNota                                        |
+------------------------------------------------------------+
| + criarOuAtualizar(db, payload: NotaBatchSchema)           |
|   : list[Nota] (upsert)                                    |
| + listarPorMatricula(db, matricula_id) : list[Nota]        |
| + listarPorTurma(db, turma_id, prova?) : list[Nota]        |
| + calcularMedia(db, turma_id) : list[MediaProvaSchema]     |
+------------------------------------------------------------+
| Exceções: ErroNotaInvalida                                 |
+------------------------------------------------------------+
```

### ServicoPresenca (`presenca_service.py`)
```
+------------------------------------------------------------+
| <<DAO>> ServicoPresenca                                    |
+------------------------------------------------------------+
| + criarOuAtualizar(db, payload: PresencaBatchSchema)       |
|   : list[Presenca] (upsert)                                |
| + listarPorTurma(db, turma_id, data_aula?) : list[Presenca]|
+------------------------------------------------------------+
```

### ServicoUsuario (`usuario_service.py`)
```
+------------------------------------------------------------+
| <<DAO>> ServicoUsuario                                     |
+------------------------------------------------------------+
| + criar(db, payload: UsuarioCreateSchema) : Usuario        |
| + listar(db) : list[Usuario]                                |
| + obterPorId(db, usuario_id) : Usuario                     |
| + atualizar(db, usuario_id,                                |
|     payload: UsuarioUpdateSchema) : Usuario                 |
| + excluir(db, usuario_id) : void                           |
+------------------------------------------------------------+
| Exceções: ErroUsuarioNaoEncontrado,                        |
|   ErroEmailJaExiste, ErroUsuarioPossuiDependencias         |
+------------------------------------------------------------+
```

### ServicoPedido (`pedido_service.py`)
```
+------------------------------------------------------------+
| <<DAO>> ServicoPedido                                      |
+------------------------------------------------------------+
| # _resolverTurma(db, turma_id) : void                      |
| + criar(db, payload: PedidoCreateSchema, usuario_id)       |
|   : Pedido (status=0)                                      |
| + listar(db) : list[Pedido]                                |
| + obterPorId(db, pedido_id) : Pedido                       |
| + aprovar(db, pedido_id) : Pedido (0->1, deduz estoque)   |
| + comprar(db, pedido_id,                                   |
|     payload: PedidoCompraSchema) : Pedido (1->2)           |
| + atualizarStatus(db, pedido_id,                           |
|     payload: PedidoUpdateSchema) : Pedido                  |
| + entregar(db, pedido_id) : Pedido (2->3, adiciona        |
|   ao estoque)                                              |
| + excluir(db, pedido_id) : void                            |
+------------------------------------------------------------+
| Exceções: ErroPedidoNaoEncontrado,                         |
|   ErroPedidoPossuiDependencias,                            |
|   ErroTurmaNaoEncontradaPedido,                            |
|   ErroTransicaoInvalida, ErroEstoqueNaoEncontrado,         |
|   ErroSaldoInsuficiente                                    |
+------------------------------------------------------------+
```

### ServicoEstoque (`estoque_service.py`)
```
+------------------------------------------------------------+
| <<DAO>> ServicoEstoque                                     |
+------------------------------------------------------------+
| + criar(db, payload: EstoqueCreateSchema) : Estoque        |
| + listar(db) : list[Estoque]                               |
| + pesquisarPorNome(db, termo) : list[Estoque]              |
| + obterPorId(db, estoque_id) : Estoque                     |
| + atualizar(db, estoque_id,                                |
|     payload: EstoqueUpdateSchema) : Estoque                |
| + excluir(db, estoque_id) : void                           |
| + darBaixa(db, estoque_id, qtd, justificativa) : Estoque   |
| + obterAlertas(db) : list[Estoque]                         |
| + deduzirPorPedido(db, pedido) : void                      |
+------------------------------------------------------------+
| Exceções: ErroEstoqueNaoEncontrado,                        |
|   ErroEstoquePossuiDependencias,                           |
|   ErroSaldoInsuficiente, ErroEstoqueJaExiste               |
+------------------------------------------------------------+
```

### ServicoDashboard (`dashboard_service.py`)
```
+------------------------------------------------------------+
| <<Service>> ServicoDashboard                               |
+------------------------------------------------------------+
| + obterKpis(db) : dict                                     |
| + obterGraficoAcademico(db) : dict                         |
| + obterGraficoLogistica(db) : dict                         |
+------------------------------------------------------------+
```

### ServicoHistorico (`historico_service.py`)
```
+------------------------------------------------------------+
| <<Service>> ServicoHistorico                               |
+------------------------------------------------------------+
| # _calcularFrequencia(presencas) : float?                  |
| + obterPorMatricula(db, matricula_id) : dict               |
+------------------------------------------------------------+
| Exceções: ErroHistoricoNaoEncontrado                       |
+------------------------------------------------------------+
```

### ServicoEmail (`email_service.py`)
```
+------------------------------------------------------------+
| <<Service>> ServicoEmail                                   |
+------------------------------------------------------------+
| + enviarEmailRedefinicao(email, token) : void              |
+------------------------------------------------------------+
```

---

## CAMADA 6 — VISÃO (Angular Frontend)

### Pacote: `frontend/src/app/`

Arquitetura Angular 21 standalone components com lazy loading.

---

### Modelos (Interfaces TypeScript)

Arquivos em: `core/models/`

| Arquivo | Interfaces |
|---------|------------|
| `aluno.model.ts` | `Aluno`, `AlunoCreatePayload`, `AlunoUpdatePayload` |
| `curso.model.ts` | `Curso`, `CursoCreatePayload`, `CursoUpdatePayload` |
| `turma.model.ts` | `Turma`, `TurmaCursoInfo`, `TurmaProfessorInfo`, `Avaliacao`, `TurmaCreatePayload`, `TurmaUpdatePayload` |
| `matricula.model.ts` | `Matricula`, `MatriculaAlunoInfo`, `MatriculaCursoInfo`, `MatriculaTurmaInfo`, `MatriculaCreatePayload`, `MatriculaUpdatePayload` |
| `nota.model.ts` | `Nota`, `NotaItem`, `NotaBatchPayload`, `MediaProva`, `MediaTurma` |
| `presenca.model.ts` | `Presenca`, `PresencaItem`, `PresencaBatchPayload` |
| `usuario.model.ts` | `Usuario`, `UsuarioCreatePayload`, `UsuarioUpdatePayload` |
| `pedido.model.ts` | `Pedido`, `ItemPedido`, `PedidoCreatePayload`, `PedidoCompraPayload`, `constantes PEDIDO_STATUS` |
| `estoque.model.ts` | `Estoque`, `EstoqueCreatePayload`, `EstoqueUpdatePayload`, `BaixaPayload`, `EstoqueAlerta` |
| `historico.model.ts` | `Historico`, `HistoricoNota`, `HistoricoPresenca`, `HistoricoAluno`, `HistoricoTurma` |
| `dashboard.model.ts` | `Kpis`, `AlunosPorCurso`, `StatusMatriculas`, `ChartAcademico`, `ConsumoItem`, `ChartLogistica` |

---

### Páginas (Componentes)

```
+------------------------------------------------------------+
| <<Component>> PaginaLogin                                  |
| path: /login | AuthModule                                  |
+------------------------------------------------------------+
| - email: string ; - senha: string ; - lembrar: boolean    |
+------------------------------------------------------------+
| + get_email() : string ; + set_email(email) : void         |
| + get_senha() : string ; + set_senha(senha) : void         |
| + get_lembrar() : boolean ; + set_lembrar(valor) : void   |
| + onSubmit() : void                                        |
| + redirecionarPorCargo(cargo: number) : void               |
+------------------------------------------------------------+
```

```
+------------------------------------------------------------+
| <<Component>> PaginaAlunos (StudentsManagementComponent)   |
| path: /admin/alunos | StudentsModule                       |
+------------------------------------------------------------+
| - alunos: Aluno[] ; - termoPesquisa: string               |
+------------------------------------------------------------+
| + get_alunos() : Aluno[] ; + set_alunos(lista) : void     |
| + get_termoPesquisa() : string                             |
| + set_termoPesquisa(termo) : void                          |
| + carregarTodos() : void                                   |
| + salvar(payload: AlunoCreatePayload) : void               |
| + atualizar(id, payload: AlunoUpdatePayload) : void        |
| + confirmarExclusao(id: number) : void                     |
+------------------------------------------------------------+
```

```
+------------------------------------------------------------+
| <<Component>> PaginaCursos (CoursesManagementComponent)    |
| path: /admin/cursos | CoursesModule                        |
+------------------------------------------------------------+
| - cursos: Curso[]                                          |
+------------------------------------------------------------+
| + get_cursos() : Curso[] ; + set_cursos(lista) : void     |
| + carregarTodos() : void                                   |
| + salvar(payload: CursoCreatePayload) : void               |
| + atualizar(id, payload: CursoUpdatePayload) : void        |
| + confirmarExclusao(id: number) : void                     |
+------------------------------------------------------------+
```

```
+------------------------------------------------------------+
| <<Component>> PaginaTurmas (ClassesManagementComponent)    |
| path: /admin/turmas | ClassesModule                        |
+------------------------------------------------------------+
| - turmas: Turma[] ; - cursos: Curso[]                      |
| - professores: Usuario[]                                   |
+------------------------------------------------------------+
| + get_turmas() : Turma[] ; + set_turmas(lista) : void     |
| + get_cursos() : Curso[] ; + set_cursos(lista) : void     |
| + get_professores() : Usuario[]                            |
| + set_professores(lista) : void                            |
| + carregarTodos() : void                                   |
| + duplicar(id: number) : void ; + excluir(id: number) : void|
+------------------------------------------------------------+
```

```
+------------------------------------------------------------+
| <<Component>> PaginaMatriculas                             |
| (EnrollmentsManagementComponent)                           |
| path: /admin/matriculas | EnrollmentsModule                |
+------------------------------------------------------------+
| - matriculas: Matricula[] ; - alunos: Aluno[]              |
| - turmas: Turma[]                                          |
+------------------------------------------------------------+
| + get_matriculas() : Matricula[]                           |
| + set_matriculas(lista) : void                             |
| + get_alunos() : Aluno[] ; + set_alunos(lista) : void     |
| + get_turmas() : Turma[] ; + set_turmas(lista) : void     |
| + carregarTodos() : void                                   |
| + salvar(payload: MatriculaCreatePayload) : void           |
| + atualizar(id, payload: MatriculaUpdatePayload) : void    |
| + confirmarExclusao(id: number) : void                     |
| + abrirHistorico(matriculaId: number) : void               |
+------------------------------------------------------------+
```

```
+------------------------------------------------------------+
| <<Component>> PaginaNotas (GradesManagementComponent)      |
| path: /admin/notas | GradesModule                          |
+------------------------------------------------------------+
| - idTurma: number ; - prova: number                        |
| - notas: Nota[] ; - medias: MediaTurma                    |
+------------------------------------------------------------+
| + get/set idTurma, prova, notas, medias                    |
| + carregarNotas(turmaId, prova) : void                     |
| + salvarNotas(payload: NotaBatchPayload) : void            |
| + carregarMedia(turmaId) : void                            |
+------------------------------------------------------------+
```

```
+------------------------------------------------------------+
| <<Component>> PaginaPresencas                              |
| (AttendanceManagementComponent)                            |
| path: /admin/presencas | AttendanceModule                  |
+------------------------------------------------------------+
| - idTurma: number ; - dataAula: string                     |
| - presencas: Presenca[]                                    |
+------------------------------------------------------------+
| + get/set idTurma, dataAula, presencas                     |
| + carregarPresencas(turmaId, data) : void                  |
| + salvarPresencas(payload: PresencaBatchPayload) : void    |
| + alternarPresenca(alunoId: number) : void                 |
+------------------------------------------------------------+
```

```
+------------------------------------------------------------+
| <<Component>> PaginaEstoque (EstoqueManagementComponent)   |
| path: /admin/logistico/estoque | LogisticoModule           |
+------------------------------------------------------------+
| - itens: Estoque[] ; - termoPesquisa: string               |
| - alertas: EstoqueAlerta[]                                 |
+------------------------------------------------------------+
| + get/set itens, termoPesquisa, alertas                    |
| + carregarTodos() : void                                   |
| + pesquisar(query: string) : void                          |
| + salvar(payload: EstoqueCreatePayload) : void             |
| + atualizar(id, payload: EstoqueUpdatePayload) : void      |
| + confirmarExclusao(id: number) : void                     |
| + abrirFormularioBaixa(item: Estoque) : void               |
+------------------------------------------------------------+
```

```
+------------------------------------------------------------+
| <<Component>> PaginaPedidos (PedidoListComponent)          |
| path: /admin/logistico/pedidos | LogisticoModule           |
+------------------------------------------------------------+
| - pedidos: Pedido[] ; - abaAtiva: string                   |
+------------------------------------------------------------+
| + get/set pedidos, abaAtiva                                |
| + carregarTodos() : void                                   |
| + aprovar(id: number) : void                               |
| + comprar(id, payload: PedidoCompraPayload) : void         |
| + entregar(id: number) : void                              |
+------------------------------------------------------------+
```

```
+------------------------------------------------------------+
| <<Component>> PaginaUsuarios (UsersManagementComponent)    |
| path: /admin/usuarios | UsersModule                        |
+------------------------------------------------------------+
| - usuarios: Usuario[]                                      |
+------------------------------------------------------------+
| + get/set usuarios                                         |
| + carregarTodos() : void                                   |
| + salvar(payload: UsuarioCreatePayload) : void             |
| + atualizar(id, payload: UsuarioUpdatePayload) : void      |
| + confirmarExclusao(id: number) : void                     |
+------------------------------------------------------------+
```

```
+------------------------------------------------------------+
| <<Component>> PaginaHistorico (TranscriptViewComponent)    |
| path: /admin/historico/matricula/:id | TranscriptModule    |
+------------------------------------------------------------+
| - historico: Historico                                     |
+------------------------------------------------------------+
| + get/set historico                                        |
| + carregarHistorico(id: number) : void                     |
| + exportarPDF() : void (html2canvas + jsPDF)               |
+------------------------------------------------------------+
```

```
+------------------------------------------------------------+
| <<Component>> PaginaInicioAdmin (AdminHome)                |
| path: /admin/home | AdminModule                            |
+------------------------------------------------------------+
| - kpis: KpisResponse ; - graficoAcademico                  |
| - graficoLogistica ; - contagemAlertas: number             |
+------------------------------------------------------------+
| + carregarKpis() : void ; + carregarGraficos() : void     |
+------------------------------------------------------------+
```

```
+------------------------------------------------------------+
| <<Component>> PaginaInicioAcademico (AcademicoHome)        |
| path: /academico | AcademicoModule (cargo 2)               |
+------------------------------------------------------------+
| - totalTurmas: number ; - totalAlunos: number              |
+------------------------------------------------------------+
| + carregarDados() : void                                   |
+------------------------------------------------------------+
```

```
+------------------------------------------------------------+
| <<Component>> PaginaDetalheTurma (TurmaDetailPage)         |
| path: /academico/turmas/:id | AcademicoModule              |
+------------------------------------------------------------+
| - turma: Turma ; - alunos: list                            |
+------------------------------------------------------------+
| + get/set turma, alunos                                    |
| + carregarTurma(id: number) : void                         |
| + carregarAlunos() : void                                  |
+------------------------------------------------------------+
```

```
+------------------------------------------------------------+
| <<Component>> PaginaFormularioPedido                       |
| (PedidoFormPageComponent)                                  |
| path: /admin/logistico/pedidos/novo | LogisticoModule     |
+------------------------------------------------------------+
| - turmas: Turma[] ; - itens: list                          |
+------------------------------------------------------------+
| + get/set turmas, itens                                    |
| + salvar(payload: PedidoCreatePayload) : void              |
+------------------------------------------------------------+
```

```
+------------------------------------------------------------+
| <<Component>> PaginaAcessoNegado (AccessDenied)            |
| path: /acesso-negado | ErrorsModule                        |
+------------------------------------------------------------+
| (sem atributos ou métodos próprios)                        |
+------------------------------------------------------------+
```

```
+------------------------------------------------------------+
| <<Component>> PaginaNaoEncontrada (NotFound)               |
| path: /** (404) | ErrorsModule                             |
+------------------------------------------------------------+
| (sem atributos ou métodos próprios)                        |
+------------------------------------------------------------+
```

---

### Serviços Angular (HTTP Clients)

Arquivos em: `core/services/`

| Serviço | Prefixo API | Métodos Principais |
|---------|-------------|-------------------|
| `ServicoAngularAluno` | `/api/v1/alunos` | `list()`, `create(payload)`, `update(id, payload)`, `delete(id)` |
| `ServicoAngularAuth` | `/api/v1/auth` | `login(email, senha)`, `forgotPassword(email)`, `resetPassword(token, novaSenha, confSenha)`, `logout()`, `isAuthenticated()`, `hasRole(roles)` |
| `ServicoAngularCurso` | `/api/v1/cursos` | `list()`, `create(payload)`, `update(id, payload)`, `delete(id)` |
| `ServicoAngularTurma` | `/api/v1/turmas` | `list()`, `listMine()`, `getById(id)`, `create(payload)`, `update(id, payload)`, `delete(id)` |
| `ServicoAngularMatricula` | `/api/v1/matriculas` | `list()`, `listMine()`, `refreshList()`, `create(payload)`, `update(id, payload)`, `delete(id)` |
| `ServicoAngularNota` | `/api/v1/notas` | `listByTurma(id, prova?)`, `listByMatricula(id)`, `create(payload)`, `getMediaTurma(id)` |
| `ServicoAngularPresenca` | `/api/v1/presencas` | `listByTurma(id, data?)`, `create(payload)` |
| `ServicoAngularUsuario` | `/api/v1/usuarios` | `list()`, `create(payload)`, `update(id, payload)`, `delete(id)` |
| `ServicoAngularPedido` | `/api/v1/pedidos` | `list()`, `create(payload)`, `aprovar(id)`, `comprar(id, payload)`, `entregar(id)`, `delete(id)` |
| `ServicoAngularEstoque` | `/api/v1/estoque` | `list()`, `search(q)`, `create(payload)`, `update(id, payload)`, `delete(id)`, `baixa(id, payload)`, `getAlertas()` |
| `ServicoAngularDashboard` | `/api/v1/dashboard` | `getKpis()`, `getChartAcademico()`, `getChartLogistica()` |
| `ServicoAngularHistorico` | `/api/v1/historico` | `getByMatricula(id)` |
| `ServicoNotificacao` | (in-app) | `error(message)`, `success(message)`, `clear()` |
| `ServicoDialogo` | (in-app) | `confirm(options)` |

---

### Guards e Interceptors

```
+------------------------------------------------------------+
| <<Guard>> GuardaAuth (core/guards/auth.guard.ts)           |
+------------------------------------------------------------+
| + canActivate() : boolean                                  |
|   (verifica se token JWT existe e não expirou)             |
+------------------------------------------------------------+
```

```
+------------------------------------------------------------+
| <<Guard>> GuardaPapel (core/guards/role.guard.ts)          |
+------------------------------------------------------------+
| + canActivate(cargosPermitidos: int[]) : boolean           |
|   (verifica cargo do token contra lista permitida)         |
+------------------------------------------------------------+
| Aliases: GuardaDiretor (cargo=1), GuardaAdmin (cargo=1,3) |
+------------------------------------------------------------+
```

```
+------------------------------------------------------------+
| <<Interceptor>> InterceptadorToken                         |
| (core/interceptors/token.interceptor.ts)                   |
+------------------------------------------------------------+
| + intercept(req: HttpRequest, next: HttpHandler)           |
|   (adiciona header Authorization: Bearer <token>)          |
+------------------------------------------------------------+
```

```
+------------------------------------------------------------+
| <<Interceptor>> InterceptadorErro                          |
| (core/interceptors/error.interceptor.ts)                   |
+------------------------------------------------------------+
| + intercept(req: HttpRequest, next: HttpHandler)           |
|   (401 -> logout, 403/409 -> notificação)                  |
+------------------------------------------------------------+
```

---

## FLUXO DE DEPENDÊNCIAS ENTRE CAMADAS

```
[VISÃO - Angular Components]
    |  HTTP Request (JSON)
    v
[CONTROLADOR - FastAPI Routers]
    |  Valida com Schemas (Pydantic)
    |  Chama funções de servico
    v
[SERVICO/DAO - Lógica de Negócio]
    |  Acessa banco via SQLAlchemy ORM
    v
[MODEL - SQLAlchemy Entities]
    |
    v
[PostgreSQL Database]
```

**Fluxo completo de uma requisição:**

1. **Visão** (Angular) → envia HTTP Request com JSON
2. **InterceptadorToken** → anexa Bearer token JWT
3. **Controlador** (FastAPI) → recebe requisição, aplica `verify_cargo()`
4. **Schema** (Pydantic) → valida payload de entrada (Create/Update)
5. **Servico/DAO** → executa regras de negócio, validações, exceções
6. **Model** (SQLAlchemy) → consulta/altera banco via ORM
7. **Resposta** → Schema (Pydantic) serializa em JSON → retorna para Visão
