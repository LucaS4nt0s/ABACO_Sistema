```mermaid
classDiagram

    %% ============================================================
    %% MODEL (SQLAlchemy Entities) - backend/app/models/
    %% ============================================================
    namespace Model {
        class Aluno {
            <<Entity>>
            -id_aluno : int (PK)
            -nome : str (NOT NULL)
            -telefone : str ?
            -data_nascimento : date ?
            -rua : str ?
            -bairro : str ?
            -numero : int ?
            +get_id_aluno() int
            +set_id_aluno(id int) void
            +get_nome() str
            +set_nome(nome str) void
            +get_telefone() str?
            +set_telefone(tel str?) void
            +get_data_nascimento() date?
            +set_data_nascimento(data date?) void
            +get_rua() str?
            +set_rua(rua str?) void
            +get_bairro() str?
            +set_bairro(bairro str?) void
            +get_numero() int?
            +set_numero(num int?) void
        }
        class Curso {
            <<Entity>>
            -id_curso : int (PK)
            -nome_curso : str (NOT NULL)
            +get_id_curso() int
            +set_id_curso(id int) void
            +get_nome_curso() str
            +set_nome_curso(nome str) void
        }
        class Turma {
            <<Entity>>
            -id_turma : int (PK)
            -capacidade : int ?
            -data_inicio : date ?
            -data_fim : date ?
            -id_curso : int (FK)
            -id_professor : int ? (FK)
            -dias_aula : str ?
            -avaliacoes : list ? (JSONB)
            +get_vagas_ocupadas() int (readonly)
            +get_id_turma() int
            +set_id_turma(id int) void
            +get_capacidade() int?
            +set_capacidade(cap int?) void
            +get_data_inicio() date?
            +set_data_inicio(data date?) void
            +get_data_fim() date?
            +set_data_fim(data date?) void
            +get_id_curso() int
            +set_id_curso(id int) void
            +get_id_professor() int?
            +set_id_professor(id int?) void
            +get_dias_aula() str?
            +set_dias_aula(dias str?) void
            +get_avaliacoes() list?
            +set_avaliacoes(avals list?) void
        }
        class Matricula {
            <<Entity>>
            -id_matricula : int (PK)
            -id_aluno : int (FK)
            -id_turma : int (FK)
            -data_matricula : date ?
            -status : int ?
            +get_id_matricula() int
            +set_id_matricula(id int) void
            +get_id_aluno() int
            +set_id_aluno(id int) void
            +get_id_turma() int
            +set_id_turma(id int) void
            +get_data_matricula() date?
            +set_data_matricula(data date?) void
            +get_status() int?
            +set_status(status int?) void
        }
        class Nota {
            <<Entity>>
            -id_nota : int (PK)
            -nota : float ?
            -prova : int ?
            -id_matricula : int (FK)
            +get_id_nota() int
            +set_id_nota(id int) void
            +get_nota() float?
            +set_nota(nota float?) void
            +get_prova() int?
            +set_prova(prova int?) void
            +get_id_matricula() int
            +set_id_matricula(id int) void
        }
        class Presenca {
            <<Entity>>
            -id_presenca : int (PK)
            -id_matricula : int (FK)
            -data_aula : date ?
            -presente : bool ?
            +get_id_presenca() int
            +set_id_presenca(id int) void
            +get_id_matricula() int
            +set_id_matricula(id int) void
            +get_data_aula() date?
            +set_data_aula(data date?) void
            +get_presente() bool?
            +set_presente(presente bool?) void
        }
        class Usuario {
            <<Entity>>
            -id_usuario : int (PK)
            -nome : str ?
            -telefone : str ?
            -email : str ? (UNIQUE)
            -senha_hash : str ?
            -cargo : int ?
            +get_id_usuario() int
            +set_id_usuario(id int) void
            +get_nome() str?
            +set_nome(nome str?) void
            +get_telefone() str?
            +set_telefone(tel str?) void
            +get_email() str?
            +set_email(email str?) void
            +get_senha_hash() str?
            +set_senha_hash(hash str?) void
            +get_cargo() int?
            +set_cargo(cargo int?) void
        }
        class Pedido {
            <<Entity>>
            -id_pedido : int (PK)
            -id_usuario : int (FK)
            -id_turma : int (FK)
            -data_pedido : date ?
            -status : int ?
            +get_id_pedido() int
            +set_id_pedido(id int) void
            +get_id_usuario() int
            +set_id_usuario(id int) void
            +get_id_turma() int
            +set_id_turma(id int) void
            +get_data_pedido() date?
            +set_data_pedido(data date?) void
            +get_status() int?
            +set_status(status int?) void
        }
        class ItemPedido {
            <<Entity>>
            -id_item_pedido : int (PK)
            -id_pedido : int (FK)
            -id_item_estoque : int ? (FK)
            -nome_item : str ?
            -quantidade : int ?
            -preco_unitario : float ?
            +get_id_item_pedido() int
            +set_id_item_pedido(id int) void
            +get_id_pedido() int
            +set_id_pedido(id int) void
            +get_id_item_estoque() int?
            +set_id_item_estoque(id int?) void
            +get_nome_item() str?
            +set_nome_item(nome str?) void
            +get_quantidade() int?
            +set_quantidade(qtd int?) void
            +get_preco_unitario() float?
            +set_preco_unitario(preco float?) void
        }
        class Estoque {
            <<Entity>>
            -id_item_estoque : int (PK)
            -nome_item : str ?
            -quantidade_disponivel : int ?
            -unidade : str ?
            -estoque_minimo : int ?
            +get_id_item_estoque() int
            +set_id_item_estoque(id int) void
            +get_nome_item() str?
            +set_nome_item(nome str?) void
            +get_quantidade_disponivel() int?
            +set_quantidade_disponivel(qtd int?) void
            +get_unidade() str?
            +set_unidade(unidade str?) void
            +get_estoque_minimo() int?
            +set_estoque_minimo(min int?) void
        }
        class MovimentacaoEstoque {
            <<Entity>>
            -id_movimentacao : int (PK)
            -id_item_estoque : int (FK)
            -quantidade : int
            -tipo_movimentacao : str
            -justificativa : str ?
            -data_movimentacao : datetime
            +get_id_movimentacao() int
            +set_id_movimentacao(id int) void
            +get_id_item_estoque() int
            +set_id_item_estoque(id int) void
            +get_quantidade() int
            +set_quantidade(qtd int) void
            +get_tipo_movimentacao() str
            +set_tipo_movimentacao(tipo str) void
            +get_justificativa() str?
            +set_justificativa(just str?) void
            +get_data_movimentacao() datetime
            +set_data_movimentacao(data datetime) void
        }

        Aluno "1" --> "*" Matricula
        Curso "1" --> "*" Turma
        Turma "1" --> "*" Matricula
        Turma "*" --> "0..1" Usuario : professor
        Turma "1" --> "*" Pedido
        Matricula "1" --> "*" Nota
        Matricula "1" --> "*" Presenca
        Usuario "1" --> "*" Pedido : solicitante
        Pedido "1" --> "*" ItemPedido
        ItemPedido "*" --> "0..1" Estoque
        Estoque "1" --> "*" MovimentacaoEstoque
    }

    %% ============================================================
    %% SCHEMA (Pydantic DTOs) - backend/app/schemas/
    %% ============================================================
    namespace Schema {
        class AlunoCreateSchema {
            <<DTO>>
            +nome : str ; +telefone : str?
            +dataNascimento : date? ; +rua : str?
            +bairro : str? ; +numero : int?
        }
        class AlunoResponseSchema {
            <<DTO>>
            +id_aluno (alias idAluno) : int
            +nome : str ; +telefone : str?
            +data_nascimento (alias dataNascimento) : date?
            +rua : str? ; +bairro : str? ; +numero : int?
        }
        class CursoResponseSchema {
            <<DTO>>
            +id_curso (alias idCurso) : int
            +nome_curso (alias nomeCurso) : str
        }
        class TurmaResponseSchema {
            <<DTO>>
            +id_turma (alias idTurma) : int ; +capacidade : int?
            +data_inicio (alias dataInicio) : date?
            +data_fim (alias dataFim) : date?
            +id_curso (alias idCurso) : int
            +id_professor (alias idProfessor) : int?
            +dias_aula (alias diasAula) : str?
            +vagas_ocupadas (alias vagasOcupadas) : int?
            +avaliacoes : list[dict]?
            +curso : TurmaCursoInfo? ; +professor : TurmaProfessorInfo?
        }
        class MatriculaResponseSchema {
            <<DTO>>
            +id_matricula (alias idMatricula) : int
            +id_aluno (alias idAluno) : int?
            +id_turma (alias idTurma) : int?
            +data_matricula (alias dataMatricula) : date?
            +status : int? ; +aluno : MatriculaAlunoInfo?
            +turma : MatriculaTurmaInfo?
        }
        class NotaResponseSchema {
            <<DTO>>
            +id_nota (alias idNota) : int
            +id_matricula (alias idMatricula) : int
            +nota : float? ; +prova : int?
            +matricula : NotaMatriculaInfo?
        }
        class NotaBatchSchema {
            <<DTO>>
            +idTurma : int ; +prova : int
            +notas : list[NotaItemSchema]
        }
        class MediaTurmaSchema {
            <<DTO>>
            +id_turma (alias idTurma) : int
            +medias : list[MediaProvaSchema]
        }
        class PresencaResponseSchema {
            <<DTO>>
            +id_presenca (alias idPresenca) : int
            +id_matricula (alias idMatricula) : int
            +data_aula (alias dataAula) : date?
            +presente : bool?
            +matricula : PresencaMatriculaInfo?
        }
        class PresencaBatchSchema {
            <<DTO>>
            +idTurma : int ; +dataAula : date
            +presencas : list[PresencaItemSchema]
        }
        class UsuarioResponseSchema {
            <<DTO>>
            +id_usuario (alias idUsuario) : int
            +nome : str? ; +telefone : str?
            +email : EmailStr? ; +cargo : int?
        }
        class PedidoResponseSchema {
            <<DTO>>
            +id_pedido (alias idPedido) : int ; +id_usuario (alias idUsuario) : int
            +id_turma (alias idTurma) : int ; +data_pedido (alias dataPedido) : date?
            +status : int? ; +usuario : UsuarioPedidoInfo?
            +turma : TurmaPedidoInfo? ; +itens : list[ItemPedidoResponseSchema]?
        }
        class EstoqueResponseSchema {
            <<DTO>>
            +id_item_estoque (alias idItemEstoque) : int
            +nome_item (alias nomeItem) : str?
            +quantidade_disponivel (alias quantidadeDisponivel) : int?
            +unidade : str? ; +estoque_minimo (alias estoqueMinimo) : int?
        }
        class LoginRequest { <<DTO>> +email : EmailStr ; +senha : str }
        class TokenResponse { <<DTO>> +access_token : str ; +token_type : str = "bearer" ; +usuario : UsuarioResponse }
        class MessageResponse { <<DTO>> +message : str }
        class KpisResponse { <<DTO>> +total_alunos_ativos : int ; +total_turmas_vigentes : int ; +total_pedidos_pendentes : int ; +total_estoque_critico : int }
        class ChartAcademicoResponse { <<DTO>> +alunos_por_curso : list[AlunosPorCurso] ; +status_matriculas : list[StatusMatriculas] }
        class ChartLogisticaResponse { <<DTO>> +consumo_mes_atual : list[ConsumoItem] }
        class HistoricoResponse { <<DTO>> +id_matricula (alias idMatricula) : int ; +data_matricula (alias dataMatricula) : date? ; +status : int? ; +aluno : HistoricoAlunoInfo ; +turma : HistoricoTurmaInfo ; +notas : list[HistoricoNotaInfo] ; +presencas : list[HistoricoPresencaInfo] ; +percentual_frequencia (alias percentualFrequencia) : float? }

        NotaBatchSchema *-- NotaItemSchema
        TurmaResponseSchema *-- TurmaCursoInfo
        TurmaResponseSchema *-- TurmaProfessorInfo
        MatriculaResponseSchema *-- MatriculaAlunoInfo
        MatriculaResponseSchema *-- MatriculaTurmaInfo
        MatriculaTurmaInfo *-- MatriculaCursoInfo
        NotaResponseSchema *-- NotaMatriculaInfo
        NotaMatriculaInfo *-- NotaAlunoInfo
        NotaMatriculaInfo *-- NotaTurmaInfo
        PresencaResponseSchema *-- PresencaMatriculaInfo
        PresencaMatriculaInfo *-- PresencaAlunoInfo
        PedidoResponseSchema *-- UsuarioPedidoInfo
        PedidoResponseSchema *-- TurmaPedidoInfo
        PedidoResponseSchema *-- ItemPedidoResponseSchema
        ItemPedidoResponseSchema *-- EstoqueItemInfo
        HistoricoResponse *-- HistoricoAlunoInfo
        HistoricoResponse *-- HistoricoTurmaInfo
        HistoricoResponse *-- HistoricoNotaInfo
        HistoricoResponse *-- HistoricoPresencaInfo
        ChartAcademicoResponse *-- AlunosPorCurso
        ChartAcademicoResponse *-- StatusMatriculas
        ChartLogisticaResponse *-- ConsumoItem
        MediaTurmaSchema *-- MediaProvaSchema
    }

    %% ============================================================
    %% CONTROLADOR (FastAPI Routers) - backend/app/api/v1/
    %% ============================================================
    namespace Controlador {
        class ControladorAuth {
            <<Controller>>
            +POST /api/v1/auth/login(LoginRequest) TokenResponse
            +POST /api/v1/auth/forgot-password(ForgotPasswordRequest) MessageResponse
            +POST /api/v1/auth/reset-password(ResetPasswordRequest) MessageResponse
        }
        class ControladorAluno {
            <<Controller>>
            +GET /api/v1/alunos() list[AlunoResponseSchema]
            +GET /api/v1/alunos/{id}() AlunoResponseSchema
            +POST /api/v1/alunos(AlunoCreateSchema) AlunoResponseSchema
            +PUT /api/v1/alunos/{id}(AlunoUpdateSchema) AlunoResponseSchema
            +DELETE /api/v1/alunos/{id}() dict
        }
        class ControladorCurso { <<Controller>> +GET /api/v1/cursos() list[CursoResponseSchema] ; +GET /api/v1/cursos/{id}() CursoResponseSchema ; +POST /api/v1/cursos(CursoCreateSchema) CursoResponseSchema ; +PUT /api/v1/cursos/{id}(CursoUpdateSchema) CursoResponseSchema ; +DELETE /api/v1/cursos/{id}() dict }
        class ControladorTurma { <<Controller>> +GET /api/v1/turmas() list[TurmaResponseSchema] ; +GET /api/v1/turmas/me() list[TurmaResponseSchema] ; +GET /api/v1/turmas/{id}() TurmaResponseSchema ; +POST /api/v1/turmas(TurmaCreateSchema) TurmaResponseSchema ; +PUT /api/v1/turmas/{id}(TurmaUpdateSchema) TurmaResponseSchema ; +DELETE /api/v1/turmas/{id}() dict }
        class ControladorMatricula { <<Controller>> +GET /api/v1/matriculas() list[MatriculaResponseSchema] ; +GET /api/v1/matriculas/me() list[MatriculaResponseSchema] ; +GET /api/v1/matriculas/{id}() MatriculaResponseSchema ; +POST /api/v1/matriculas(MatriculaCreateSchema) MatriculaResponseSchema ; +PUT /api/v1/matriculas/{id}(MatriculaUpdateSchema) MatriculaResponseSchema ; +DELETE /api/v1/matriculas/{id}() dict }
        class ControladorNota { <<Controller>> +POST /api/v1/notas(NotaBatchSchema) list[NotaResponseSchema] ; +GET /api/v1/notas/matricula/{id}() list[NotaResponseSchema] ; +GET /api/v1/notas/turma/{id}(prova?) list[NotaResponseSchema] ; +GET /api/v1/notas/media/turma/{id}() MediaTurmaSchema }
        class ControladorPresenca { <<Controller>> +POST /api/v1/presencas(PresencaBatchSchema) list[PresencaResponseSchema] ; +GET /api/v1/presencas/turma/{id}(dataAula?) list[PresencaResponseSchema] }
        class ControladorUsuario { <<Controller>> +GET /api/v1/usuarios() list[UsuarioResponseSchema] ; +GET /api/v1/usuarios/{id}() UsuarioResponseSchema ; +POST /api/v1/usuarios(UsuarioCreateSchema) UsuarioResponseSchema ; +PUT /api/v1/usuarios/{id}(UsuarioUpdateSchema) UsuarioResponseSchema ; +DELETE /api/v1/usuarios/{id}() dict }
        class ControladorPedido { <<Controller>> +GET /api/v1/pedidos() list[PedidoResponseSchema] ; +GET /api/v1/pedidos/{id}() PedidoResponseSchema ; +POST /api/v1/pedidos(PedidoCreateSchema) PedidoResponseSchema ; +PUT /api/v1/pedidos/{id}/aprovar() PedidoResponseSchema ; +PUT /api/v1/pedidos/{id}/comprar(PedidoCompraSchema) PedidoResponseSchema ; +PUT /api/v1/pedidos/{id}(PedidoUpdateSchema) PedidoResponseSchema ; +PUT /api/v1/pedidos/{id}/entregar() PedidoResponseSchema ; +DELETE /api/v1/pedidos/{id}() dict }
        class ControladorEstoque { <<Controller>> +GET /api/v1/estoque() list[EstoqueResponseSchema] ; +GET /api/v1/estoque/search(q) list[EstoqueResponseSchema] ; +GET /api/v1/estoque/alertas() list[EstoqueAlertaResponseSchema] ; +GET /api/v1/estoque/{id}() EstoqueResponseSchema ; +POST /api/v1/estoque(EstoqueCreateSchema) EstoqueResponseSchema ; +PUT /api/v1/estoque/{id}(EstoqueUpdateSchema) EstoqueResponseSchema ; +DELETE /api/v1/estoque/{id}() dict ; +PUT /api/v1/estoque/{id}/baixa(EstoqueBaixaSchema) EstoqueResponseSchema }
        class ControladorDashboard { <<Controller>> +GET /api/v1/dashboard/kpis() KpisResponse ; +GET /api/v1/dashboard/charts/academico() ChartAcademicoResponse ; +GET /api/v1/dashboard/charts/logistica() ChartLogisticaResponse }
        class ControladorHistorico { <<Controller>> +GET /api/v1/historico/matricula/{id}() HistoricoResponse }
    }

    %% ============================================================
    %% NUCLEO (Core Infrastructure) - backend/app/core/ + db/
    %% ============================================================
    namespace Nucleo {
        class Configuracao {
            <<Configuration>>
            +app_name : str = "SGA ABACO API"
            +database_url : str ; +secret_key : str
            +jwt_algorithm : str = "HS256"
            +access_token_expire_minutes : int = 120
            +reset_token_expire_minutes : int = 15
            +frontend_url : str ; +cors_origins : str
            +rate_limit_auth : str ; +rate_limit_default : str
            +get_cors_origin_list() list[str]
        }
        class Seguranca {
            <<Utility>>
            +verify_password(plain: str, hash: str) bool
            +hash_password(password: str) str
            +create_access_token(subject: str, cargo: int, expires_delta?) str
            +create_reset_token(email: str, expires_delta?) str
            +decode_reset_token(token: str) dict
        }
        class DependenciasAuth {
            <<Utility>>
            +get_current_user(authorization?: str) dict
            +verify_cargo(*cargos: int) callable
        }
        class BancoDados {
            <<Infrastructure>>
            +engine : Engine ; +SessionLocal : sessionmaker
            +Base : declarative_base ; +get_db() Session
        }
    }

    %% ============================================================
    %% SERVICO (Services/DAO) - backend/app/services/
    %% ============================================================
    namespace Servico {
        class ServicoAuth { <<Service>> +autenticarUsuario(db, email, senha) Usuario ; +construirRespostaLogin(usuario) dict ; +processarEsqueciSenha(db, email) str ; +processarRedefinirSenha(db, token, novaSenha, confirmar) void }
        class ServicoAluno { <<DAO>> +criar(db, payload) Aluno ; +listar(db) list[Aluno] ; +obterPorId(db, id) Aluno ; +atualizar(db, id, payload) Aluno ; +excluir(db, id) void }
        class ServicoCurso { <<DAO>> +criar(db, payload) Curso ; +listar(db) list[Curso] ; +obterPorId(db, id) Curso ; +atualizar(db, id, payload) Curso ; +excluir(db, id) void }
        class ServicoTurma { <<DAO>> #_resolverCurso(db, curso_id) void ; #_resolverProfessor(db, prof_id) void ; +criar(db, payload) Turma ; +listar(db) list[Turma] ; +listarPorProfessor(db, profId) list[Turma] ; +obterPorId(db, id) Turma ; +atualizar(db, id, payload) Turma ; +excluir(db, id) void }
        class ServicoMatricula { <<DAO>> #_resolverAluno(db, aluno_id) void ; #_resolverTurma(db, turma_id) void ; #_verificarTurmaLotada(db, turma_id) void ; #_verificarMatriculaDuplicada(db, alunoId, turmaId, excId?) void ; +criar(db, payload) Matricula ; +listar(db) list[Matricula] ; +listarPorProfessor(db, profId) list[Matricula] ; +obterPorId(db, id) Matricula ; +atualizar(db, id, payload) Matricula ; +excluir(db, id) void }
        class ServicoNota { <<DAO>> +criarOuAtualizar(db, payload) list[Nota] ; +listarPorMatricula(db, id) list[Nota] ; +listarPorTurma(db, id, prova?) list[Nota] ; +calcularMedia(db, turmaId) list[MediaProvaSchema] }
        class ServicoPresenca { <<DAO>> +criarOuAtualizar(db, payload) list[Presenca] ; +listarPorTurma(db, id, data?) list[Presenca] }
        class ServicoUsuario { <<DAO>> +criar(db, payload) Usuario ; +listar(db) list[Usuario] ; +obterPorId(db, id) Usuario ; +atualizar(db, id, payload) Usuario ; +excluir(db, id) void }
        class ServicoPedido { <<DAO>> #_resolverTurma(db, turma_id) void ; +criar(db, payload, usuarioId) Pedido ; +listar(db) list[Pedido] ; +obterPorId(db, id) Pedido ; +aprovar(db, id) Pedido ; +comprar(db, id, payload) Pedido ; +atualizarStatus(db, id, payload) Pedido ; +entregar(db, id) Pedido ; +excluir(db, id) void }
        class ServicoEstoque { <<DAO>> +criar(db, payload) Estoque ; +listar(db) list[Estoque] ; +pesquisarPorNome(db, termo) list[Estoque] ; +obterPorId(db, id) Estoque ; +atualizar(db, id, payload) Estoque ; +excluir(db, id) void ; +darBaixa(db, id, qtd, just) Estoque ; +obterAlertas(db) list[Estoque] ; +deduzirPorPedido(db, pedido) void }
        class ServicoDashboard { <<DAO>> +obterKpis(db) dict ; +obterGraficoAcademico(db) dict ; +obterGraficoLogistica(db) dict }
        class ServicoHistorico { <<DAO>> #_calcularFrequencia(presencas) float? ; +obterPorMatricula(db, id) dict }
        class ServicoEmail { <<Service>> +enviarEmailRedefinicao(email, token) void }
    }

    %% ============================================================
    %% VISAO (Angular Frontend) - frontend/src/app/
    %% ============================================================
    namespace Visao {
        class PaginaLogin { <<Component>> -email: string ; -senha: string ; -lembrar: bool ; +onSubmit() void ; +redirecionarPorCargo(cargo) void }
        class PaginaRecuperarSenha { <<Component>> -email: string ; +onSubmit() void }
        class PaginaRedefinirSenha { <<Component>> -token: string ; -novaSenha: string ; -confirmarSenha: string ; +onSubmit() void }
        class PaginaInicioAdmin { <<Component>> -kpis: any ; -graficoAcademico: any ; -graficoLogistica: any ; -contagemAlertas: number ; +carregarKpis() void ; +carregarGraficos() void }
        class PaginaAlunos { <<Component>> -alunos: any[] ; -termoPesquisa: string ; +carregarTodos() void ; +salvar(data) void ; +confirmarExclusao(id) void }
        class PaginaCursos { <<Component>> -cursos: any[] ; +carregarTodos() void ; +salvar(data) void ; +confirmarExclusao(id) void }
        class PaginaTurmas { <<Component>> -turmas: any[] ; -cursos: any[] ; -professores: any[] ; +carregarTodos() void ; +duplicar(id) void ; +excluir(id) void }
        class PaginaMatriculas { <<Component>> -matriculas: any[] ; -alunos: any[] ; -turmas: any[] ; +carregarTodos() void ; +salvar(data) void ; +confirmarExclusao(id) void ; +abrirHistorico(id) void }
        class PaginaNotas { <<Component>> -idTurma: number ; -prova: number ; -notas: any[] ; -medias: any ; +carregarNotas(turmaId, prova) void ; +salvarNotas(payload) void ; +carregarMedia(turmaId) void }
        class PaginaPresencas { <<Component>> -idTurma: number ; -dataAula: string ; -presencas: any[] ; +carregarPresencas(turmaId, data) void ; +salvarPresencas(payload) void ; +alternarPresenca(alunoId) void }
        class PaginaEstoque { <<Component>> -itens: any[] ; -termoPesquisa: string ; -alertas: any[] ; +carregarTodos() void ; +pesquisar(texto) void ; +salvar(data) void ; +abrirFormularioBaixa(item) void }
        class PaginaPedidos { <<Component>> -pedidos: any[] ; -abaAtiva: string ; +carregarTodos() void ; +aprovar(id) void ; +comprar(id, payload) void ; +entregar(id) void }
        class PaginaUsuarios { <<Component>> -usuarios: any[] ; +carregarTodos() void ; +salvar(data) void ; +confirmarExclusao(id) void }
        class PaginaHistorico { <<Component>> -historico: any ; +carregarHistorico(id) void ; +exportarPDF() void }
        class PaginaInicioAcademico { <<Component>> -totalTurmas: number ; -totalAlunos: number ; +carregarDados() void }
        class PaginaDetalheTurma { <<Component>> -turma: any ; -alunos: any[] ; +carregarTurma(id) void ; +carregarAlunos() void }
        class PaginaFormularioPedido { <<Component>> -turmas: any[] ; -itens: any[] ; +salvar(payload) void }
        class PaginaAcessoNegado { <<Component>> }
        class PaginaNaoEncontrada { <<Component>> }

        class ServicoAngularAluno { <<Service>> +list() Observable~Aluno~ ; +create(payload) Observable~Aluno~ ; +update(id, payload) Observable~Aluno~ ; +delete(id) Observable~dict~ }
        class ServicoAngularAuth { <<Service>> +login(email, senha) Observable~LoginResponse~ ; +forgotPassword(email) Observable~MessageResponse~ ; +resetPassword(token, novSenha, confSenha) Observable~MessageResponse~ ; +logout() void ; +isAuthenticated() bool }
        class ServicoAngularTurma { <<Service>> +list() Observable~Turma~[] ; +listMine() Observable~Turma~[] ; +getById(id) Observable~Turma~ ; +create(payload) Observable~Turma~ ; +update(id, payload) Observable~Turma~ ; +delete(id) Observable~dict~ }
        class ServicoAngularMatricula { <<Service>> +list() Observable~Matricula~[] ; +listMine() Observable~Matricula~[] ; +create(payload) Observable~Matricula~ ; +update(id, payload) Observable~Matricula~ ; +delete(id) Observable~dict~ }
        class ServicoAngularNota { <<Service>> +listByTurma(id, prova?) Observable~Nota~[] ; +listByMatricula(id) Observable~Nota~[] ; +create(payload) Observable~Nota~[] ; +getMediaTurma(id) Observable~MediaTurma~ }
        class ServicoAngularPresenca { <<Service>> +listByTurma(id, data?) Observable~Presenca~[] ; +create(payload) Observable~Presenca~[] }
        class ServicoAngularUsuario { <<Service>> +list() Observable~Usuario~[] ; +create(payload) Observable~Usuario~ ; +update(id, payload) Observable~Usuario~ ; +delete(id) Observable~dict~ }
        class ServicoAngularPedido { <<Service>> +list() Observable~Pedido~[] ; +create(payload) Observable~Pedido~ ; +aprovar(id) Observable~Pedido~ ; +comprar(id, payload) Observable~Pedido~ ; +entregar(id) Observable~Pedido~ ; +delete(id) Observable~dict~ }
        class ServicoAngularEstoque { <<Service>> +list() Observable~Estoque~[] ; +search(q) Observable~Estoque~[] ; +create(payload) Observable~Estoque~ ; +update(id, payload) Observable~Estoque~ ; +delete(id) Observable~dict~ ; +baixa(id, payload) Observable~Estoque~ ; +getAlertas() Observable~EstoqueAlerta~[] }
        class ServicoAngularDashboard { <<Service>> +getKpis() Observable~Kpis~ ; +getChartAcademico() Observable~ChartAcademico~ ; +getChartLogistica() Observable~ChartLogistica~ }
        class ServicoAngularHistorico { <<Service>> +getByMatricula(id) Observable~Historico~ }
        class ServicoNotificacao { <<Service>> +error(message) void ; +success(message) void ; +clear() void }

        class GuardaAuth { <<Guard>> +canActivate() bool }
        class GuardaPapel { <<Guard>> +canActivate(cargos: int[]) bool }
        class InterceptadorToken { <<Interceptor>> +intercept(req, next) HttpEvent }
        class InterceptadorErro { <<Interceptor>> +intercept(req, next) HttpEvent }
    }
```
