# DIAGRAMA DE CLASSE UML — SGA ABACO

**Arquitetura em 4 camadas: Model, Visão, Controlador e DAO/Service**

**Legenda:**
- `-` privado | `#` protegido | `+` público
- Para relacionamentos: `1` (um) | `*` (muitos) | `0..1` (zero ou um) | `?` (opcional)

---

## CAMADA 1 — MODEL (Entidades do Banco de Dados)

### Pacote: `backend/app/models/`

---

### Classe: Aluno
```
+------------------------------------------------------+
| <<Entity>> Aluno                                     |
+------------------------------------------------------+
| - id_aluno: int                                      |
| - nome: str                                          |
| - telefone: str ?                                    |
| - data_nascimento: date ?                            |
| - rua: str ?                                         |
| - bairro: str ?                                      |
| - numero: int ?                                      |
+------------------------------------------------------+
| + get_id_aluno() : int                               |
| + set_id_aluno(id_aluno: int) : void                 |
| + get_nome() : str                                   |
| + set_nome(nome: str) : void                         |
| + get_telefone() : str                               |
| + set_telefone(telefone: str) : void                 |
| + get_data_nascimento() : date                       |
| + set_data_nascimento(data_nascimento: date) : void  |
| + get_rua() : str                                    |
| + set_rua(rua: str) : void                           |
| + get_bairro() : str                                 |
| + set_bairro(bairro: str) : void                     |
| + get_numero() : int                                 |
| + set_numero(numero: int) : void                     |
+------------------------------------------------------+
```

**Relacionamentos:**
- Aluno `1` ---- `*` Matricula

---

### Classe: Curso
```
+------------------------------------------------------+
| <<Entity>> Curso                                     |
+------------------------------------------------------+
| - id_curso: int                                      |
| - nome_curso: str                                    |
+------------------------------------------------------+
| + get_id_curso() : int                               |
| + set_id_curso(id_curso: int) : void                 |
| + get_nome_curso() : str                             |
| + set_nome_curso(nome_curso: str) : void             |
+------------------------------------------------------+
```

**Relacionamentos:**
- Curso `1` ---- `*` Turma

---

### Classe: Turma
```
+------------------------------------------------------+
| <<Entity>> Turma                                     |
+------------------------------------------------------+
| - id_turma: int                                      |
| - capacidade: int ?                                  |
| - data_inicio: date ?                                |
| - data_fim: date ?                                   |
| - id_curso: int                                      |
| - id_professor: int ?                                |
| - dias_aula: str ?                                   |
| - avaliacoes: json ?                                 |
| + vagas_ocupadas: int (readonly)                     |
+------------------------------------------------------+
| + get_id_turma() : int                               |
| + set_id_turma(id_turma: int) : void                 |
| + get_capacidade() : int                             |
| + set_capacidade(capacidade: int) : void             |
| + get_data_inicio() : date                           |
| + set_data_inicio(data_inicio: date) : void          |
| + get_data_fim() : date                              |
| + set_data_fim(data_fim: date) : void                |
| + get_id_curso() : int                               |
| + set_id_curso(id_curso: int) : void                 |
| + get_id_professor() : int                           |
| + set_id_professor(id_professor: int) : void         |
| + get_dias_aula() : str                              |
| + set_dias_aula(dias_aula: str) : void               |
| + get_avaliacoes() : json                            |
| + set_avaliacoes(avaliacoes: json) : void            |
| + get_vagas_ocupadas() : int                         |
+------------------------------------------------------+
```

**Relacionamentos:**
- Turma `*` ---- `1` Curso
- Turma `*` ---- `0..1` Usuario (professor)
- Turma `1` ---- `*` Matricula
- Turma `1` ---- `*` Pedido

---

### Classe: Matricula
```
+------------------------------------------------------+
| <<Entity>> Matricula                                 |
+------------------------------------------------------+
| - id_matricula: int                                  |
| - id_aluno: int                                      |
| - id_turma: int                                      |
| - data_matricula: date ?                             |
| - status: int ?                                      |
+------------------------------------------------------+
| + get_id_matricula() : int                           |
| + set_id_matricula(id_matricula: int) : void         |
| + get_id_aluno() : int                               |
| + set_id_aluno(id_aluno: int) : void                 |
| + get_id_turma() : int                               |
| + set_id_turma(id_turma: int) : void                 |
| + get_data_matricula() : date                        |
| + set_data_matricula(data_matricula: date) : void    |
| + get_status() : int                                 |
| + set_status(status: int) : void                     |
+------------------------------------------------------+
```

**Relacionamentos:**
- Matricula `*` ---- `1` Aluno
- Matricula `*` ---- `1` Turma
- Matricula `1` ---- `*` Nota
- Matricula `1` ---- `*` Presenca

---

### Classe: Nota
```
+------------------------------------------------------+
| <<Entity>> Nota                                      |
+------------------------------------------------------+
| - id_nota: int                                       |
| - nota: float ?                                      |
| - prova: int ?                                       |
| - id_matricula: int                                  |
+------------------------------------------------------+
| + get_id_nota() : int                                |
| + set_id_nota(id_nota: int) : void                   |
| + get_nota() : float                                 |
| + set_nota(nota: float) : void                       |
| + get_prova() : int                                  |
| + set_prova(prova: int) : void                       |
| + get_id_matricula() : int                           |
| + set_id_matricula(id_matricula: int) : void         |
+------------------------------------------------------+
```

**Relacionamentos:**
- Nota `*` ---- `1` Matricula

---

### Classe: Presenca
```
+------------------------------------------------------+
| <<Entity>> Presenca                                  |
+------------------------------------------------------+
| - id_presenca: int                                   |
| - id_matricula: int                                  |
| - data_aula: date ?                                  |
| - presente: bool ?                                   |
+------------------------------------------------------+
| + get_id_presenca() : int                            |
| + set_id_presenca(id_presenca: int) : void           |
| + get_id_matricula() : int                           |
| + set_id_matricula(id_matricula: int) : void         |
| + get_data_aula() : date                             |
| + set_data_aula(data_aula: date) : void              |
| + get_presente() : bool                              |
| + set_presente(presente: bool) : void                |
+------------------------------------------------------+
```

**Relacionamentos:**
- Presenca `*` ---- `1` Matricula

---

### Classe: Usuario
```
+------------------------------------------------------+
| <<Entity>> Usuario                                   |
+------------------------------------------------------+
| - id_usuario: int                                    |
| - nome: str ?                                        |
| - telefone: str ?                                    |
| - email: str (unique) ?                              |
| - senha_hash: str ?                                  |
| - cargo: int ?                                       |
+------------------------------------------------------+
| + get_id_usuario() : int                             |
| + set_id_usuario(id_usuario: int) : void             |
| + get_nome() : str                                   |
| + set_nome(nome: str) : void                         |
| + get_telefone() : str                               |
| + set_telefone(telefone: str) : void                 |
| + get_email() : str                                  |
| + set_email(email: str) : void                       |
| + get_senha_hash() : str                             |
| + set_senha_hash(senha_hash: str) : void             |
| + get_cargo() : int                                  |
| + set_cargo(cargo: int) : void                       |
+------------------------------------------------------+
```

**Relacionamentos:**
- Usuario `1` ---- `*` Turma (como professor)
- Usuario `1` ---- `*` Pedido (como solicitante)

---

### Classe: Pedido
```
+------------------------------------------------------+
| <<Entity>> Pedido                                    |
+------------------------------------------------------+
| - id_pedido: int                                     |
| - id_usuario: int                                    |
| - id_turma: int                                      |
| - data_pedido: date ?                                |
| - status: int ?                                      |
+------------------------------------------------------+
| + get_id_pedido() : int                              |
| + set_id_pedido(id_pedido: int) : void               |
| + get_id_usuario() : int                             |
| + set_id_usuario(id_usuario: int) : void             |
| + get_id_turma() : int                               |
| + set_id_turma(id_turma: int) : void                 |
| + get_data_pedido() : date                           |
| + set_data_pedido(data_pedido: date) : void          |
| + get_status() : int                                 |
| + set_status(status: int) : void                     |
+------------------------------------------------------+
```

**Relacionamentos:**
- Pedido `*` ---- `1` Usuario
- Pedido `*` ---- `1` Turma
- Pedido `1` ---- `*` ItemPedido

---

### Classe: ItemPedido
```
+------------------------------------------------------+
| <<Entity>> ItemPedido                                |
+------------------------------------------------------+
| - id_item_pedido: int                                |
| - id_pedido: int                                     |
| - id_item_estoque: int ?                             |
| - nome_item: str ?                                   |
| - quantidade: int ?                                  |
| - preco_unitario: float ?                            |
+------------------------------------------------------+
| + get_id_item_pedido() : int                         |
| + set_id_item_pedido(id_item_pedido: int) : void     |
| + get_id_pedido() : int                              |
| + set_id_pedido(id_pedido: int) : void               |
| + get_id_item_estoque() : int                        |
| + set_id_item_estoque(id_item_estoque: int) : void   |
| + get_nome_item() : str                              |
| + set_nome_item(nome_item: str) : void               |
| + get_quantidade() : int                             |
| + set_quantidade(quantidade: int) : void             |
| + get_preco_unitario() : float                       |
| + set_preco_unitario(preco_unitario: float) : void   |
+------------------------------------------------------+
```

**Relacionamentos:**
- ItemPedido `*` ---- `1` Pedido
- ItemPedido `*` ---- `0..1` Estoque

---

### Classe: Estoque
```
+------------------------------------------------------+
| <<Entity>> Estoque                                   |
+------------------------------------------------------+
| - id_item_estoque: int                               |
| - nome_item: str ?                                   |
| - quantidade_disponivel: int ?                       |
| - unidade: str ?                                     |
| - estoque_minimo: int ?                              |
+------------------------------------------------------+
| + get_id_item_estoque() : int                        |
| + set_id_item_estoque(id_item_estoque: int) : void   |
| + get_nome_item() : str                              |
| + set_nome_item(nome_item: str) : void               |
| + get_quantidade_disponivel() : int                  |
| + set_quantidade_disponivel(quantidade: int) : void  |
| + get_unidade() : str                                |
| + set_unidade(unidade: str) : void                   |
| + get_estoque_minimo() : int                         |
| + set_estoque_minimo(estoque_minimo: int) : void     |
+------------------------------------------------------+
```

**Relacionamentos:**
- Estoque `1` ---- `*` ItemPedido
- Estoque `1` ---- `*` MovimentacaoEstoque

---

### Classe: MovimentacaoEstoque
```
+----------------------------------------------------------+
| <<Entity>> MovimentacaoEstoque                            |
+----------------------------------------------------------+
| - id_movimentacao: int                                    |
| - id_item_estoque: int                                    |
| - quantidade: int                                         |
| - tipo_movimentacao: str                                  |
| - justificativa: str ?                                    |
| - data_movimentacao: datetime                             |
+----------------------------------------------------------+
| + get_id_movimentacao() : int                             |
| + set_id_movimentacao(id_movimentacao: int) : void        |
| + get_id_item_estoque() : int                             |
| + set_id_item_estoque(id_item_estoque: int) : void        |
| + get_quantidade() : int                                  |
| + set_quantidade(quantidade: int) : void                  |
| + get_tipo_movimentacao() : str                           |
| + set_tipo_movimentacao(tipo_movimentacao: str) : void    |
| + get_justificativa() : str                               |
| + set_justificativa(justificativa: str) : void            |
| + get_data_movimentacao() : datetime                      |
| + set_data_movimentacao(data_movimentacao: datetime) : void |
+----------------------------------------------------------+
```

**Relacionamentos:**
- MovimentacaoEstoque `*` ---- `1` Estoque

---

## CAMADA 2 — CONTROLADOR (API REST / FastAPI Routers)

### Pacote: `backend/app/api/v1/`

---

### Classe: ControladorAuth
```
+----------------------------------------------------------+
| <<Controller>> ControladorAuth                            |
| prefixo: /api/v1/auth                                     |
+----------------------------------------------------------+
| + login(payload: LoginRequest) -> TokenResponse           |
| + forgotPassword(payload: ForgotPasswordRequest)          |
|   -> MensagemResponse                                     |
| + resetPassword(payload: ResetPasswordRequest)            |
|   -> MensagemResponse                                     |
+----------------------------------------------------------+
| Depende de: ServicoAuth, ServicoEmail                     |
+----------------------------------------------------------+
```

---

### Classe: ControladorAluno
```
+----------------------------------------------------------+
| <<Controller>> ControladorAluno                           |
| prefixo: /api/v1/alunos                                   |
+----------------------------------------------------------+
| + listar() -> list[AlunoResponseSchema]                   |
| + obterPorId(aluno_id: int) -> AlunoResponseSchema        |
| + criar(payload: AlunoCreateSchema)                       |
|   -> AlunoResponseSchema                                  |
| + atualizar(aluno_id: int, payload: AlunoUpdateSchema)    |
|   -> AlunoResponseSchema                                  |
| + excluir(aluno_id: int) -> dict                          |
+----------------------------------------------------------+
| Depende de: ServicoAluno                                  |
+----------------------------------------------------------+
```

---

### Classe: ControladorCurso
```
+----------------------------------------------------------+
| <<Controller>> ControladorCurso                           |
| prefixo: /api/v1/cursos                                   |
+----------------------------------------------------------+
| + listar() -> list[CursoResponseSchema]                   |
| + obterPorId(curso_id: int) -> CursoResponseSchema        |
| + criar(payload: CursoCreateSchema) -> CursoResponseSchema|
| + atualizar(curso_id: int, payload: CursoUpdateSchema)    |
|   -> CursoResponseSchema                                  |
| + excluir(curso_id: int) -> dict                          |
+----------------------------------------------------------+
| Depende de: ServicoCurso                                  |
+----------------------------------------------------------+
```

---

### Classe: ControladorTurma
```
+----------------------------------------------------------+
| <<Controller>> ControladorTurma                           |
| prefixo: /api/v1/turmas                                   |
+----------------------------------------------------------+
| + listar() -> list[TurmaResponseSchema]                   |
| + listarMinhas() -> list[TurmaResponseSchema]             |
| + obterPorId(turma_id: int) -> TurmaResponseSchema        |
| + criar(payload: TurmaCreateSchema) -> TurmaResponseSchema|
| + atualizar(turma_id: int, payload: TurmaUpdateSchema)    |
|   -> TurmaResponseSchema                                  |
| + excluir(turma_id: int) -> dict                          |
+----------------------------------------------------------+
| Depende de: ServicoTurma                                  |
+----------------------------------------------------------+
```

---

### Classe: ControladorMatricula
```
+----------------------------------------------------------+
| <<Controller>> ControladorMatricula                       |
| prefixo: /api/v1/matriculas                               |
+----------------------------------------------------------+
| + listar() -> list[MatriculaResponseSchema]               |
| + listarMinhas() -> list[MatriculaResponseSchema]         |
| + obterPorId(matricula_id: int) -> MatriculaResponseSchema|
| + criar(payload: MatriculaCreateSchema)                   |
|   -> MatriculaResponseSchema                              |
| + atualizar(matricula_id: int, payload: MatriculaUpdateSchema)|
|   -> MatriculaResponseSchema                              |
| + excluir(matricula_id: int) -> dict                      |
+----------------------------------------------------------+
| Depende de: ServicoMatricula                              |
+----------------------------------------------------------+
```

---

### Classe: ControladorNota
```
+----------------------------------------------------------+
| <<Controller>> ControladorNota                            |
| prefixo: /api/v1/notas                                    |
+----------------------------------------------------------+
| + criarEmLote(payload: NotaBatchSchema)                   |
|   -> list[NotaResponseSchema]                             |
| + obterPorMatricula(matricula_id: int)                    |
|   -> list[NotaResponseSchema]                             |
| + obterPorTurma(turma_id: int, prova: int?)              |
|   -> list[NotaResponseSchema]                             |
| + obterMediaTurma(turma_id: int) -> MediaTurmaSchema      |
+----------------------------------------------------------+
| Depende de: ServicoNota                                   |
+----------------------------------------------------------+
```

---

### Classe: ControladorPresenca
```
+----------------------------------------------------------+
| <<Controller>> ControladorPresenca                        |
| prefixo: /api/v1/presencas                                |
+----------------------------------------------------------+
| + criarEmLote(payload: PresencaBatchSchema)               |
|   -> list[PresencaResponseSchema]                         |
| + obterPorTurma(turma_id: int, data_aula: date?)         |
|   -> list[PresencaResponseSchema]                         |
+----------------------------------------------------------+
| Depende de: ServicoPresenca                               |
+----------------------------------------------------------+
```

---

### Classe: ControladorUsuario
```
+----------------------------------------------------------+
| <<Controller>> ControladorUsuario                         |
| prefixo: /api/v1/usuarios                                 |
+----------------------------------------------------------+
| + listar() -> list[UsuarioResponseSchema]                 |
| + obterPorId(usuario_id: int) -> UsuarioResponseSchema    |
| + criar(payload: UsuarioCreateSchema)                     |
|   -> UsuarioResponseSchema                                |
| + atualizar(usuario_id: int, payload: UsuarioUpdateSchema)|
|   -> UsuarioResponseSchema                                |
| + excluir(usuario_id: int) -> dict                        |
+----------------------------------------------------------+
| Depende de: ServicoUsuario                                |
+----------------------------------------------------------+
```

---

### Classe: ControladorPedido
```
+----------------------------------------------------------+
| <<Controller>> ControladorPedido                          |
| prefixo: /api/v1/pedidos                                  |
+----------------------------------------------------------+
| + listar() -> list[PedidoResponseSchema]                  |
| + obterPorId(pedido_id: int) -> PedidoResponseSchema      |
| + criar(payload: PedidoCreateSchema, idUsuario: int)      |
|   -> PedidoResponseSchema                                 |
| + aprovar(pedido_id: int) -> PedidoResponseSchema         |
| + comprar(pedido_id: int, payload: PedidoCompraSchema)    |
|   -> PedidoResponseSchema                                 |
| + atualizarStatus(pedido_id: int, payload: PedidoUpdateSchema)|
|   -> PedidoResponseSchema                                 |
| + entregar(pedido_id: int) -> PedidoResponseSchema        |
| + excluir(pedido_id: int) -> dict                         |
+----------------------------------------------------------+
| Depende de: ServicoPedido, ServicoEstoque                 |
+----------------------------------------------------------+
```

---

### Classe: ControladorEstoque
```
+----------------------------------------------------------+
| <<Controller>> ControladorEstoque                         |
| prefixo: /api/v1/estoque                                  |
+----------------------------------------------------------+
| + listar() -> list[EstoqueResponseSchema]                 |
| + pesquisar(q: str) -> list[EstoqueResponseSchema]        |
| + obterAlertas() -> list[EstoqueAlertaResponseSchema]     |
| + obterPorId(estoque_id: int) -> EstoqueResponseSchema    |
| + criar(payload: EstoqueCreateSchema)                     |
|   -> EstoqueResponseSchema                                |
| + atualizar(estoque_id: int, payload: EstoqueUpdateSchema)|
|   -> EstoqueResponseSchema                                |
| + excluir(estoque_id: int) -> dict                        |
| + darBaixa(estoque_id: int, payload: EstoqueBaixaSchema)  |
|   -> EstoqueResponseSchema                                |
+----------------------------------------------------------+
| Depende de: ServicoEstoque                                |
+----------------------------------------------------------+
```

---

### Classe: ControladorDashboard
```
+----------------------------------------------------------+
| <<Controller>> ControladorDashboard                       |
| prefixo: /api/v1/dashboard                                |
+----------------------------------------------------------+
| + obterKpis() -> KpisResponse                             |
| + obterGraficoAcademico() -> ChartAcademicoResponse       |
| + obterGraficoLogistica() -> ChartLogisticaResponse       |
+----------------------------------------------------------+
| Depende de: ServicoDashboard                              |
+----------------------------------------------------------+
```

---

### Classe: ControladorHistorico
```
+----------------------------------------------------------+
| <<Controller>> ControladorHistorico                       |
| prefixo: /api/v1/historico                                |
+----------------------------------------------------------+
| + obterPorMatricula(matricula_id: int)                    |
|   -> HistoricoResponse                                    |
+----------------------------------------------------------+
| Depende de: ServicoHistorico                              |
+----------------------------------------------------------+
```

---

## CAMADA 3 — SERVICE/DAO (Lógica de Negócio e Acesso a Dados)

### Pacote: `backend/app/services/`

---

### Classe: ServicoAuth
```
+----------------------------------------------------------+
| <<Service>> ServicoAuth                                   |
+----------------------------------------------------------+
| + autenticarUsuario(db: Session, email: str,             |
|     senha: str) -> Usuario                                |
| + construirRespostaLogin(usuario: Usuario) -> dict        |
| + processarEsqueciSenha(db: Session,                      |
|     email: str) -> str                                    |
| + processarRedefinirSenha(db: Session, token: str,       |
|     nova_senha: str, confirmar_senha: str) -> None        |
+----------------------------------------------------------+
| Depende de: SecurityUtils                                 |
+----------------------------------------------------------+
```

---

### Classe: ServicoAluno
```
+----------------------------------------------------------+
| <<DAO>> ServicoAluno                                      |
+----------------------------------------------------------+
| + criar(db: Session, payload: AlunoCreateSchema) -> Aluno |
| + listar(db: Session) -> list[Aluno]                      |
| + obterPorId(db: Session, aluno_id: int) -> Aluno         |
| + atualizar(db: Session, aluno_id: int,                   |
|     payload: AlunoUpdateSchema) -> Aluno                  |
| + excluir(db: Session, aluno_id: int) -> None             |
+----------------------------------------------------------+
```

---

### Classe: ServicoCurso
```
+----------------------------------------------------------+
| <<DAO>> ServicoCurso                                      |
+----------------------------------------------------------+
| + criar(db: Session, payload: CursoCreateSchema) -> Curso |
| + listar(db: Session) -> list[Curso]                      |
| + obterPorId(db: Session, curso_id: int) -> Curso         |
| + atualizar(db: Session, curso_id: int,                   |
|     payload: CursoUpdateSchema) -> Curso                  |
| + excluir(db: Session, curso_id: int) -> None             |
+----------------------------------------------------------+
```

---

### Classe: ServicoTurma
```
+----------------------------------------------------------+
| <<DAO>> ServicoTurma                                      |
+----------------------------------------------------------+
| # _resolverCurso(db: Session, curso_id: int) -> None      |
| # _resolverProfessor(db: Session, prof_id: int?) -> None  |
| + criar(db: Session, payload: TurmaCreateSchema) -> Turma |
| + listar(db: Session) -> list[Turma]                      |
| + listarPorProfessor(db: Session, prof_id: int) -> list   |
| + obterPorId(db: Session, turma_id: int) -> Turma         |
| + atualizar(db: Session, turma_id: int,                   |
|     payload: TurmaUpdateSchema) -> Turma                  |
| + excluir(db: Session, turma_id: int) -> None             |
+----------------------------------------------------------+
```

---

### Classe: ServicoMatricula
```
+----------------------------------------------------------+
| <<DAO>> ServicoMatricula                                  |
+----------------------------------------------------------+
| # _resolverAluno(db: Session, aluno_id: int) -> None      |
| # _resolverTurma(db: Session, turma_id: int) -> None      |
| # _verificarTurmaLotada(db: Session, turma_id: int) -> None|
| # _obterCursoIdPorTurma(db: Session, turma_id: int)-> int |
| # _verificarMatriculaDuplicada(db: Session,               |
|     aluno_id: int, turma_id: int, excluir_id: int?)-> None|
| + criar(db: Session, payload: MatriculaCreateSchema)      |
|   -> Matricula                                             |
| + listar(db: Session) -> list[Matricula]                   |
| + listarPorProfessor(db: Session, prof_id: int) -> list    |
| + obterPorId(db: Session, matricula_id: int) -> Matricula  |
| + atualizar(db: Session, matricula_id: int,               |
|     payload: MatriculaUpdateSchema) -> Matricula           |
| + excluir(db: Session, matricula_id: int) -> None          |
+----------------------------------------------------------+
```

---

### Classe: ServicoNota
```
+----------------------------------------------------------+
| <<DAO>> ServicoNota                                       |
+----------------------------------------------------------+
| + criarOuAtualizar(db: Session,                           |
|     payload: NotaBatchSchema) -> list[Nota]               |
| + listarPorMatricula(db: Session,                         |
|     matricula_id: int) -> list[Nota]                      |
| + listarPorTurma(db: Session, turma_id: int,              |
|     prova: int?) -> list[Nota]                            |
| + calcularMedia(db: Session, turma_id: int) -> list       |
+----------------------------------------------------------+
```

---

### Classe: ServicoPresenca
```
+----------------------------------------------------------+
| <<DAO>> ServicoPresenca                                   |
+----------------------------------------------------------+
| + criarOuAtualizar(db: Session,                           |
|     payload: PresencaBatchSchema) -> list[Presenca]       |
| + listarPorTurma(db: Session, turma_id: int,             |
|     data_aula: date?) -> list[Presenca]                   |
+----------------------------------------------------------+
```

---

### Classe: ServicoUsuario
```
+----------------------------------------------------------+
| <<DAO>> ServicoUsuario                                    |
+----------------------------------------------------------+
| + criar(db: Session, payload: UsuarioCreateSchema)        |
|   -> Usuario                                              |
| + listar(db: Session) -> list[Usuario]                    |
| + obterPorId(db: Session, usuario_id: int) -> Usuario     |
| + atualizar(db: Session, usuario_id: int,                 |
|     payload: UsuarioUpdateSchema) -> Usuario              |
| + excluir(db: Session, usuario_id: int) -> None           |
+----------------------------------------------------------+
```

---

### Classe: ServicoPedido
```
+----------------------------------------------------------+
| <<DAO>> ServicoPedido                                     |
+----------------------------------------------------------+
| # _resolverTurma(db: Session, turma_id: int) -> None      |
| + criar(db: Session, payload: PedidoCreateSchema,         |
|     usuario_id: int) -> Pedido                            |
| + listar(db: Session) -> list[Pedido]                     |
| + obterPorId(db: Session, pedido_id: int) -> Pedido       |
| + aprovar(db: Session, pedido_id: int) -> Pedido          |
| + comprar(db: Session, pedido_id: int,                    |
|     payload: PedidoCompraSchema) -> Pedido                |
| + atualizarStatus(db: Session, pedido_id: int,            |
|     payload: PedidoUpdateSchema) -> Pedido                |
| + entregar(db: Session, pedido_id: int) -> Pedido         |
| + excluir(db: Session, pedido_id: int) -> None            |
+----------------------------------------------------------+
```

---

### Classe: ServicoEstoque
```
+----------------------------------------------------------+
| <<DAO>> ServicoEstoque                                    |
+----------------------------------------------------------+
| + criar(db: Session, payload: EstoqueCreateSchema)        |
|   -> Estoque                                              |
| + listar(db: Session) -> list[Estoque]                    |
| + pesquisarPorNome(db: Session, termo: str) -> list       |
| + obterPorId(db: Session, estoque_id: int) -> Estoque     |
| + atualizar(db: Session, estoque_id: int,                 |
|     payload: EstoqueUpdateSchema) -> Estoque              |
| + excluir(db: Session, estoque_id: int) -> None           |
| + darBaixa(db: Session, estoque_id: int,                 |
|     quantidade: int, justificativa: str) -> Estoque       |
| + obterAlertas(db: Session) -> list[Estoque]              |
| + deduzirPorPedido(db: Session, pedido: Pedido) -> None   |
+----------------------------------------------------------+
```

---

### Classe: ServicoDashboard
```
+----------------------------------------------------------+
| <<Service>> ServicoDashboard                              |
+----------------------------------------------------------+
| + obterKpis(db: Session) -> dict                          |
| + obterGraficoAcademico(db: Session) -> dict              |
| + obterGraficoLogistica(db: Session) -> dict              |
+----------------------------------------------------------+
```

---

### Classe: ServicoHistorico
```
+----------------------------------------------------------+
| <<Service>> ServicoHistorico                              |
+----------------------------------------------------------+
| # _calcularFrequencia(presencas: list[Presenca]) -> float?|
| + obterPorMatricula(db: Session,                          |
|     matricula_id: int) -> dict                            |
+----------------------------------------------------------+
```

---

### Classe: ServicoEmail
```
+----------------------------------------------------------+
| <<Service>> ServicoEmail                                  |
+----------------------------------------------------------+
| + enviarEmailRedefinicao(email: str, token: str) -> void  |
+----------------------------------------------------------+
```

---

## CAMADA 4 — VISÃO (Interface Angular)

### Pacote: `frontend/src/app/features/`

---

### Classe: PaginaLogin
```
+----------------------------------------------------------+
| <<Component>> PaginaLogin                                 |
| path: /login                                              |
+----------------------------------------------------------+
| - email: string                                           |
| - senha: string                                           |
| - lembrar: boolean                                        |
+----------------------------------------------------------+
| + get_email() : string                                    |
| + set_email(email: string) : void                         |
| + get_senha() : string                                    |
| + set_senha(senha: string) : void                         |
| + get_lembrar() : boolean                                 |
| + set_lembrar(lembrar: boolean) : void                    |
| + onSubmit() : void                                       |
| + redirecionarPorCargo(cargo: number) : void              |
+----------------------------------------------------------+
```

---

### Classe: PaginaRecuperarSenha
```
+----------------------------------------------------------+
| <<Component>> PaginaRecuperarSenha                        |
| path: /forgot-password                                    |
+----------------------------------------------------------+
| - email: string                                           |
+----------------------------------------------------------+
| + get_email() : string                                    |
| + set_email(email: string) : void                         |
| + onSubmit() : void                                       |
+----------------------------------------------------------+
```

---

### Classe: PaginaRedefinirSenha
```
+----------------------------------------------------------+
| <<Component>> PaginaRedefinirSenha                        |
| path: /reset-password                                     |
+----------------------------------------------------------+
| - token: string                                           |
| - novaSenha: string                                       |
| - confirmarSenha: string                                  |
+----------------------------------------------------------+
| + get_token() : string                                    |
| + set_token(token: string) : void                         |
| + get_novaSenha() : string                                |
| + set_novaSenha(novaSenha: string) : void                 |
| + get_confirmarSenha() : string                           |
| + set_confirmarSenha(confirmarSenha: string) : void       |
| + onSubmit() : void                                       |
+----------------------------------------------------------+
```

---

### Classe: PaginaInicioAdmin
```
+----------------------------------------------------------+
| <<Component>> PaginaInicioAdmin                           |
| path: /admin/home                                         |
+----------------------------------------------------------+
| - kpis: KpisResponse                                      |
| - graficoAcademico: ChartAcademicoResponse                |
| - graficoLogistica: ChartLogisticaResponse                |
| - contagemAlertas: number                                 |
+----------------------------------------------------------+
| + get_kpis() : KpisResponse                               |
| + set_kpis(kpis: KpisResponse) : void                     |
| + get_graficoAcademico() : ChartAcademicoResponse         |
| + set_graficoAcademico(grafico: ChartAcademicoResponse): void|
| + get_graficoLogistica() : ChartLogisticaResponse         |
| + set_graficoLogistica(grafico: ChartLogisticaResponse): void|
| + get_contagemAlertas() : number                          |
| + set_contagemAlertas(contagem: number) : void            |
| + carregarKpis() : void                                   |
| + carregarGraficos() : void                               |
+----------------------------------------------------------+
```

---

### Classe: PaginaAlunos
```
+----------------------------------------------------------+
| <<Component>> PaginaAlunos                                |
| path: /admin/alunos                                       |
+----------------------------------------------------------+
| - alunos: list[Aluno]                                     |
| - termoPesquisa: string                                   |
+----------------------------------------------------------+
| + get_alunos() : list[Aluno]                              |
| + set_alunos(alunos: list[Aluno]) : void                  |
| + get_termoPesquisa() : string                            |
| + set_termoPesquisa(termo: string) : void                 |
| + carregarTodos() : void                                  |
| + salvar(data: AlunoCreatePayload) : void                 |
| + atualizar(id: number, data: AlunoUpdatePayload) : void  |
| + confirmarExclusao(id: number) : void                    |
+----------------------------------------------------------+
```

---

### Classe: PaginaCursos
```
+----------------------------------------------------------+
| <<Component>> PaginaCursos                                |
| path: /admin/cursos                                       |
+----------------------------------------------------------+
| - cursos: list[Curso]                                     |
+----------------------------------------------------------+
| + get_cursos() : list[Curso]                              |
| + set_cursos(cursos: list[Curso]) : void                  |
| + carregarTodos() : void                                  |
| + salvar(data: CursoCreatePayload) : void                 |
| + atualizar(id: number, data: CursoUpdatePayload) : void  |
| + confirmarExclusao(id: number) : void                    |
+----------------------------------------------------------+
```

---

### Classe: PaginaTurmas
```
+----------------------------------------------------------+
| <<Component>> PaginaTurmas                                |
| path: /admin/turmas                                       |
+----------------------------------------------------------+
| - turmas: list[Turma]                                     |
| - cursos: list[Curso]                                     |
| - professores: list[Usuario]                              |
+----------------------------------------------------------+
| + get_turmas() : list[Turma]                              |
| + set_turmas(turmas: list[Turma]) : void                  |
| + get_cursos() : list[Curso]                              |
| + set_cursos(cursos: list[Curso]) : void                  |
| + get_professores() : list[Usuario]                       |
| + set_professores(professores: list[Usuario]) : void      |
| + carregarTodos() : void                                  |
| + duplicar(id: number) : void                             |
| + excluir(id: number) : void                              |
+----------------------------------------------------------+
```

---

### Classe: PaginaMatriculas
```
+----------------------------------------------------------+
| <<Component>> PaginaMatriculas                            |
| path: /admin/matriculas                                   |
+----------------------------------------------------------+
| - matriculas: list[Matricula]                             |
| - alunos: list[Aluno]                                     |
| - turmas: list[Turma]                                     |
+----------------------------------------------------------+
| + get_matriculas() : list[Matricula]                      |
| + set_matriculas(matriculas: list[Matricula]) : void      |
| + get_alunos() : list[Aluno]                              |
| + set_alunos(alunos: list[Aluno]) : void                  |
| + get_turmas() : list[Turma]                              |
| + set_turmas(turmas: list[Turma]) : void                  |
| + carregarTodos() : void                                  |
| + salvar(payload: MatriculaCreatePayload) : void          |
| + atualizar(id: number, payload: MatriculaUpdatePayload): void|
| + confirmarExclusao(id: number) : void                    |
| + abrirHistorico(matriculaId: number) : void              |
+----------------------------------------------------------+
```

---

### Classe: PaginaNotas
```
+----------------------------------------------------------+
| <<Component>> PaginaNotas                                 |
| path: /admin/notas                                        |
+----------------------------------------------------------+
| - idTurma: number                                         |
| - prova: number                                           |
| - notas: list[Nota]                                       |
| - medias: MediaTurmaSchema                                |
+----------------------------------------------------------+
| + get_idTurma() : number                                  |
| + set_idTurma(idTurma: number) : void                     |
| + get_prova() : number                                    |
| + set_prova(prova: number) : void                         |
| + get_notas() : list[Nota]                                |
| + set_notas(notas: list[Nota]) : void                     |
| + get_medias() : MediaTurmaSchema                         |
| + set_medias(medias: MediaTurmaSchema) : void             |
| + carregarNotas(turmaId: number, prova: number) : void   |
| + salvarNotas(payload: NotaBatchPayload) : void           |
| + carregarMedia(turmaId: number) : void                   |
+----------------------------------------------------------+
```

---

### Classe: PaginaPresencas
```
+----------------------------------------------------------+
| <<Component>> PaginaPresencas                             |
| path: /admin/presencas                                    |
+----------------------------------------------------------+
| - idTurma: number                                         |
| - dataAula: string                                        |
| - presencas: list[Presenca]                               |
+----------------------------------------------------------+
| + get_idTurma() : number                                  |
| + set_idTurma(idTurma: number) : void                     |
| + get_dataAula() : string                                 |
| + set_dataAula(dataAula: string) : void                   |
| + get_presencas() : list[Presenca]                        |
| + set_presencas(presencas: list[Presenca]) : void         |
| + carregarPresencas(turmaId: number, data: string) : void|
| + salvarPresencas(payload: PresencaBatchPayload) : void   |
| + alternarPresenca(alunoId: number) : void                |
+----------------------------------------------------------+
```

---

### Classe: PaginaEstoque
```
+----------------------------------------------------------+
| <<Component>> PaginaEstoque                               |
| path: /admin/logistico/estoque                            |
+----------------------------------------------------------+
| - itens: list[Estoque]                                    |
| - termoPesquisa: string                                   |
| - alertas: list[EstoqueAlerta]                            |
+----------------------------------------------------------+
| + get_itens() : list[Estoque]                             |
| + set_itens(itens: list[Estoque]) : void                  |
| + get_termoPesquisa() : string                            |
| + set_termoPesquisa(termo: string) : void                 |
| + get_alertas() : list[EstoqueAlerta]                     |
| + set_alertas(alertas: list[EstoqueAlerta]) : void        |
| + carregarTodos() : void                                  |
| + pesquisar(query: string) : void                         |
| + carregarAlertas() : void                                |
| + salvar(payload: EstoqueCreatePayload) : void            |
| + atualizar(id: number, payload: EstoqueUpdatePayload): void|
| + confirmarExclusao(id: number) : void                    |
| + abrirFormularioBaixa(item: Estoque) : void              |
+----------------------------------------------------------+
```

---

### Classe: PaginaPedidos
```
+----------------------------------------------------------+
| <<Component>> PaginaPedidos                               |
| path: /admin/logistico/pedidos                            |
+----------------------------------------------------------+
| - pedidos: list[Pedido]                                   |
| - abaAtiva: string                                        |
+----------------------------------------------------------+
| + get_pedidos() : list[Pedido]                            |
| + set_pedidos(pedidos: list[Pedido]) : void               |
| + get_abaAtiva() : string                                 |
| + set_abaAtiva(abaAtiva: string) : void                   |
| + carregarTodos() : void                                  |
| + aprovar(id: number) : void                              |
| + comprar(id: number, payload: PedidoCompraPayload): void |
| + entregar(id: number) : void                             |
| + confirmarExclusao(id: number) : void                    |
+----------------------------------------------------------+
```

---

### Classe: PaginaUsuarios
```
+----------------------------------------------------------+
| <<Component>> PaginaUsuarios                              |
| path: /admin/usuarios                                     |
+----------------------------------------------------------+
| - usuarios: list[Usuario]                                 |
+----------------------------------------------------------+
| + get_usuarios() : list[Usuario]                          |
| + set_usuarios(usuarios: list[Usuario]) : void            |
| + carregarTodos() : void                                  |
| + salvar(payload: UsuarioCreatePayload) : void            |
| + atualizar(id: number, payload: UsuarioUpdatePayload): void|
| + confirmarExclusao(id: number) : void                    |
+----------------------------------------------------------+
```

---

### Classe: PaginaHistorico
```
+----------------------------------------------------------+
| <<Component>> PaginaHistorico                             |
| path: /admin/historico/matricula/:id                      |
+----------------------------------------------------------+
| - historico: Historico                                    |
+----------------------------------------------------------+
| + get_historico() : Historico                             |
| + set_historico(historico: Historico) : void              |
| + carregarHistorico(matriculaId: number) : void           |
| + exportarPDF() : void                                    |
+----------------------------------------------------------+
```

---

### Classe: PaginaInicioAcademico
```
+----------------------------------------------------------+
| <<Component>> PaginaInicioAcademico                       |
| path: /academico                                          |
+----------------------------------------------------------+
| - totalTurmas: number                                     |
| - totalAlunos: number                                     |
+----------------------------------------------------------+
| + get_totalTurmas() : number                              |
| + set_totalTurmas(total: number) : void                   |
| + get_totalAlunos() : number                              |
| + set_totalAlunos(total: number) : void                   |
| + carregarDados() : void                                  |
+----------------------------------------------------------+
```

---

### Classe: PaginaDetalheTurma
```
+----------------------------------------------------------+
| <<Component>> PaginaDetalheTurma                          |
| path: /academico/turmas/:id                               |
+----------------------------------------------------------+
| - turma: Turma                                            |
| - alunos: list (alunos da turma)                          |
+----------------------------------------------------------+
| + get_turma() : Turma                                     |
| + set_turma(turma: Turma) : void                          |
| + get_alunos() : list                                     |
| + set_alunos(alunos: list) : void                         |
| + carregarTurma(id: number) : void                        |
| + carregarAlunos() : void                                 |
+----------------------------------------------------------+
```

---

### Classe: PaginaFormularioPedido
```
+----------------------------------------------------------+
| <<Component>> PaginaFormularioPedido                      |
| path: /academico/pedidos/novo                             |
+----------------------------------------------------------+
| - turmas: list[Turma]                                     |
| - itens: list (itens do pedido)                           |
+----------------------------------------------------------+
| + get_turmas() : list[Turma]                              |
| + set_turmas(turmas: list[Turma]) : void                  |
| + get_itens() : list                                      |
| + set_itens(itens: list) : void                           |
| + salvar(payload: PedidoCreatePayload) : void             |
+----------------------------------------------------------+
```

---

### Classe: PaginaAcessoNegado
```
+----------------------------------------------------------+
| <<Component>> PaginaAcessoNegado                          |
| path: /acesso-negado                                      |
+----------------------------------------------------------+
| (sem atributos ou métodos próprios)                       |
+----------------------------------------------------------+
```

---

### Classe: PaginaNaoEncontrada
```
+----------------------------------------------------------+
| <<Component>> PaginaNaoEncontrada                         |
| path: /** (404)                                           |
+----------------------------------------------------------+
| (sem atributos ou métodos próprios)                       |
+----------------------------------------------------------+
```

---

### Classe: RoteamentoApp
```
+----------------------------------------------------------+
| <<Configuration>> RoteamentoApp                           |
+----------------------------------------------------------+
| Rotas:                                                    |
| ""        → redirect(/login)                              |
| /login    → PaginaLogin                                  |
| /forgot-password → PaginaRecuperarSenha                   |
| /reset-password → PaginaRedefinirSenha                    |
| /acesso-negado → PaginaAcessoNegado                       |
| /academico → RotasAcademicas (cargo 2)                    |
| /admin     → RotasAdmin (cargos 1,3)                      |
| /**       → PaginaNaoEncontrada                           |
+----------------------------------------------------------+
```

---

### Classe: GuardaAuth
```
+----------------------------------------------------------+
| <<Guard>> GuardaAuth                                      |
+----------------------------------------------------------+
| + canActivate() : boolean                                 |
|   (verifica token JWT válido no localStorage)             |
+----------------------------------------------------------+
```

---

### Classe: GuardaPapel
```
+----------------------------------------------------------+
| <<Guard>> GuardaPapel(cargosPermitidos: int[])           |
+----------------------------------------------------------+
| + canActivate() : boolean                                 |
|   (verifica cargo do token contra lista                   |
|    de cargos permitidos)                                  |
+----------------------------------------------------------+
```

---

### Classe: InterceptadorToken
```
+----------------------------------------------------------+
| <<Interceptor>> InterceptadorToken                       |
+----------------------------------------------------------+
| + intercept(req: HttpRequest, next: HttpHandler)          |
|   (adiciona header Authorization: Bearer token)           |
+----------------------------------------------------------+
```

---

### Classe: InterceptadorErro
```
+----------------------------------------------------------+
| <<Interceptor>> InterceptadorErro                        |
+----------------------------------------------------------+
| + intercept(req: HttpRequest, next: HttpHandler)          |
|   (trata erros 401, 403, 409 exibindo                    |
|    notificações do backend)                               |
+----------------------------------------------------------+
```

---

## RESUMO DOS RELACIONAMENTOS ENTRE CAMADAS

```
[VISÃO - Angular Components]
    |  (HTTP request + JSON response)
    v
[CONTROLADOR - FastAPI Routers]
    |  (chama funções de serviço)
    v
[SERVICE/DAO - Lógica de Negócio]
    |  (SQLAlchemy ORM queries)
    v
[MODEL - SQLAlchemy Entities]
    |
    v
[PostgreSQL Database]
```

**Fluxo de dependência:** Visão → Controlador → Service/DAO → Model → Database

**Fluxo de dados (Request):** HTTP Request → Controlador (valida schema) → Service (regras de negócio) → DAO (queries) → Model (ORM) → Database

**Fluxo de dados (Response):** Database → Model (ORM) → DAO (resultados) → Service (transformação) → Controlador (serialização via Pydantic) → JSON Response → Visão
