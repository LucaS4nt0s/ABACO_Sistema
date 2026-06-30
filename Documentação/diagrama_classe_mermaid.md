```mermaid
classDiagram

    %% ============================================================
    %% MODELS - backend/app/models/
    %% ============================================================
    namespace models {

        class Aluno {
            <<Entity>> tabela: aluno
            -id_aluno: int (PK, column: idaluno)
            -nome: str (NOT NULL)
            -telefone: str?
            -data_nascimento: date? (column: nascimento)
            -rua: str?
            -bairro: str?
            -numero: int?
            +get_id_aluno() int
            +get_nome() str
            +get_telefone() str?
            +get_data_nascimento() date?
            +get_rua() str?
            +get_bairro() str?
            +get_numero() int?
            +set_id_aluno(id) void
            +set_nome(nome) void
            +set_telefone(tel) void
            +set_data_nascimento(data) void
            +set_rua(rua) void
            +set_bairro(bairro) void
            +set_numero(num) void
        }

        class Curso {
            <<Entity>> tabela: curso
            -id_curso: int (PK, column: idcurso)
            -nome_curso: str (NOT NULL, column: nomecurso)
            +get_id_curso() int
            +get_nome_curso() str
            +set_id_curso(id) void
            +set_nome_curso(nome) void
        }

        class Turma {
            <<Entity>> tabela: turma
            -id_turma: int (PK)
            -capacidade: int?
            -data_inicio: date?
            -data_fim: date?
            -id_curso: int (FK)
            -id_professor: int? (FK)
            -dias_aula: str?
            -avaliacoes: list? (JSONB)
            +vagas_ocupadas: int (readonly)
            +get_id_turma() int
            +get_capacidade() int?
            +get_data_inicio() date?
            +get_data_fim() date?
            +get_id_curso() int
            +get_id_professor() int?
            +get_dias_aula() str?
            +get_avaliacoes() list?
            +get_vagas_ocupadas() int
        }

        class Matricula {
            <<Entity>> tabela: matricula
            -id_matricula: int (PK)
            -id_aluno: int (FK)
            -id_turma: int (FK)
            -data_matricula: date?
            -status: int?
            +get_id_matricula() int
            +get_id_aluno() int
            +get_id_turma() int
            +get_data_matricula() date?
            +get_status() int?
        }

        class Nota {
            <<Entity>> tabela: nota
            -id_nota: int (PK)
            -nota: float?
            -prova: int?
            -id_matricula: int (FK)
            +get_id_nota() int
            +get_nota() float?
            +get_prova() int?
            +get_id_matricula() int
        }

        class Presenca {
            <<Entity>> tabela: presenca
            -id_presenca: int (PK)
            -id_matricula: int (FK)
            -data_aula: date?
            -presente: bool?
            +get_id_presenca() int
            +get_id_matricula() int
            +get_data_aula() date?
            +get_presente() bool?
        }

        class Usuario {
            <<Entity>> tabela: usuario
            -id_usuario: int (PK)
            -nome: str?
            -telefone: str?
            -email: str? (UNIQUE)
            -senha_hash: str?
            -cargo: int?
            +get_id_usuario() int
            +get_nome() str?
            +get_telefone() str?
            +get_email() str?
            +get_senha_hash() str?
            +get_cargo() int?
        }

        class Pedido {
            <<Entity>> tabela: pedido
            -id_pedido: int (PK)
            -id_usuario: int (FK)
            -id_turma: int (FK)
            -data_pedido: date?
            -status: int?
            +get_id_pedido() int
            +get_id_usuario() int
            +get_id_turma() int
            +get_data_pedido() date?
            +get_status() int?
        }

        class ItemPedido {
            <<Entity>> tabela: itempedido
            -id_item_pedido: int (PK)
            -id_pedido: int (FK)
            -id_item_estoque: int? (FK)
            -nome_item: str?
            -quantidade: int?
            -preco_unitario: float?
            +get_id_item_pedido() int
            +get_id_pedido() int
            +get_id_item_estoque() int?
            +get_nome_item() str?
            +get_quantidade() int?
            +get_preco_unitario() float?
        }

        class Estoque {
            <<Entity>> tabela: estoque
            -id_item_estoque: int (PK)
            -nome_item: str?
            -quantidade_disponivel: int?
            -unidade: str?
            -estoque_minimo: int?
            +get_id_item_estoque() int
            +get_nome_item() str?
            +get_quantidade_disponivel() int?
            +get_unidade() str?
            +get_estoque_minimo() int?
        }

        class MovimentacaoEstoque {
            <<Entity>> tabela: movimentacao_estoque
            -id_movimentacao: int (PK)
            -id_item_estoque: int (FK)
            -quantidade: int
            -tipo_movimentacao: str
            -justificativa: str?
            -data_movimentacao: datetime
            +get_id_movimentacao() int
            +get_id_item_estoque() int
            +get_quantidade() int
            +get_tipo_movimentacao() str
            +get_justificativa() str?
            +get_data_movimentacao() datetime
        }


        %% RELATIONSHIPS
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
    %% SCHEMAS - backend/app/schemas/
    %% ============================================================
    namespace schemas {

        class AlunoCreateSchema { <<DTO>> +nome: str ; +telefone: str? ; +dataNascimento: date? ; +rua: str? ; +bairro: str? ; +numero: int? }
        class AlunoResponseSchema { <<DTO>> +id_aluno (alias idAluno): int ; +nome: str ; +telefone: str? ; +data_nascimento (alias dataNascimento): date? ; +rua: str? ; +bairro: str? ; +numero: int? }
        class CursoCreateSchema { <<DTO>> +nomeCurso: str }
        class CursoResponseSchema { <<DTO>> +id_curso (alias idCurso): int ; +nome_curso (alias nomeCurso): str }
        class TurmaCreateSchema { <<DTO>> +capacidade: int? ; +dataInicio: date? ; +dataFim: date? ; +idCurso: int ; +idProfessor: int? ; +diasAula: str? ; +avaliacoes: list? }
        class TurmaResponseSchema { <<DTO>> +id_turma (alias idTurma): int ; +capacidade: int? ; +data_inicio (alias dataInicio): date? ; +data_fim (alias dataFim): date? ; +id_curso (alias idCurso): int ; +id_professor (alias idProfessor): int? ; +dias_aula (alias diasAula): str? ; +vagas_ocupadas (alias vagasOcupadas): int? ; +avaliacoes: list? ; +curso: TurmaCursoInfo? ; +professor: TurmaProfessorInfo? }
        class MatriculaCreateSchema { <<DTO>> +idAluno: int ; +idTurma: int ; +dataMatricula: date? ; +status: int? }
        class MatriculaResponseSchema { <<DTO>> +id_matricula (alias idMatricula): int ; +id_aluno (alias idAluno): int? ; +id_turma (alias idTurma): int? ; +data_matricula (alias dataMatricula): date? ; +status: int? ; +aluno: MatriculaAlunoInfo? ; +turma: MatriculaTurmaInfo? }
        class NotaBatchSchema { <<DTO>> +idTurma: int ; +prova: int ; +notas: list[NotaItemSchema] }
        class NotaResponseSchema { <<DTO>> +id_nota (alias idNota): int ; +id_matricula (alias idMatricula): int ; +nota: float? ; +prova: int? ; +matricula: NotaMatriculaInfo? }
        class MediaTurmaSchema { <<DTO>> +id_turma (alias idTurma): int ; +medias: list[MediaProvaSchema] }
        class PresencaBatchSchema { <<DTO>> +idTurma: int ; +dataAula: date ; +presencas: list[PresencaItemSchema] }
        class PresencaResponseSchema { <<DTO>> +id_presenca (alias idPresenca): int ; +id_matricula (alias idMatricula): int ; +data_aula (alias dataAula): date? ; +presente: bool? ; +matricula: PresencaMatriculaInfo? }
        class UsuarioCreateSchema { <<DTO>> +nome: str ; +email: EmailStr ; +senha: str ; +cargo: int ; +telefone: str? }
        class UsuarioResponseSchema { <<DTO>> +id_usuario (alias idUsuario): int ; +nome: str? ; +telefone: str? ; +email: EmailStr? ; +cargo: int? }
        class PedidoCreateSchema { <<DTO>> +idTurma: int ; +dataPedido: date? ; +itens: list[ItemPedidoCreateSchema] }
        class PedidoResponseSchema { <<DTO>> +id_pedido (alias idPedido): int ; +id_usuario (alias idUsuario): int ; +id_turma (alias idTurma): int ; +data_pedido (alias dataPedido): date? ; +status: int? ; +usuario: UsuarioPedidoInfo? ; +turma: TurmaPedidoInfo? ; +itens: list[ItemPedidoResponseSchema]? }
        class EstoqueCreateSchema { <<DTO>> +nomeItem: str ; +quantidadeDisponivel: int? ; +unidade: str? ; +estoqueMinimo: int? }
        class EstoqueResponseSchema { <<DTO>> +id_item_estoque (alias idItemEstoque): int ; +nome_item (alias nomeItem): str? ; +quantidade_disponivel (alias quantidadeDisponivel): int? ; +unidade: str? ; +estoque_minimo (alias estoqueMinimo): int? }
        class LoginRequest { <<DTO>> +email: EmailStr ; +senha: str }
        class TokenResponse { <<DTO>> +access_token: str ; +token_type: str = "bearer" ; +usuario: UsuarioResponse }
        class MessageResponse { <<DTO>> +message: str }
        class KpisResponse { <<DTO>> +total_alunos_ativos: int ; +total_turmas_vigentes: int ; +total_pedidos_pendentes: int ; +total_estoque_critico: int }
        class ChartAcademicoResponse { <<DTO>> +alunos_por_curso: list[AlunosPorCurso] ; +status_matriculas: list[StatusMatriculas] }
        class ChartLogisticaResponse { <<DTO>> +consumo_mes_atual: list[ConsumoItem] }
        class HistoricoResponse { <<DTO>> +id_matricula (alias idMatricula): int ; +data_matricula (alias dataMatricula): date? ; +status: int? ; +aluno: HistoricoAlunoInfo ; +turma: HistoricoTurmaInfo ; +notas: list[HistoricoNotaInfo] ; +presencas: list[HistoricoPresencaInfo] ; +percentual_frequencia (alias percentualFrequencia): float? }


        %% Schema compositions
        TurmaResponseSchema *-- TurmaCursoInfo
        MatriculaResponseSchema *-- MatriculaAlunoInfo
        MatriculaResponseSchema *-- MatriculaTurmaInfo
        NotaResponseSchema *-- NotaMatriculaInfo
        PresencaResponseSchema *-- PresencaMatriculaInfo
        PedidoResponseSchema *-- UsuarioPedidoInfo
        PedidoResponseSchema *-- TurmaPedidoInfo
        PedidoResponseSchema *-- ItemPedidoResponseSchema
        HistoricoResponse *-- HistoricoAlunoInfo
        HistoricoResponse *-- HistoricoTurmaInfo
        ChartAcademicoResponse *-- AlunosPorCurso
        ChartAcademicoResponse *-- StatusMatriculas
        ChartLogisticaResponse *-- ConsumoItem
        MediaTurmaSchema *-- MediaProvaSchema
    }

    %% ============================================================
    %% API / V1 - backend/app/api/v1/
    %% ============================================================
    namespace api_v1 {

        class AuthRouter {
            <<Controller>>
            +login(payload, request, db) TokenResponse
            +forgot_password(payload, request, db) MessageResponse
            +reset_password(payload, request, db) MessageResponse
        }
        class AlunoRouter {
            <<Controller>>
            +read_alunos(current_user, db) list
            +read_aluno(aluno_id, current_user, db) AlunoResponseSchema
            +create_alunos(payload, current_user, db) AlunoResponseSchema
            +update_alunos(aluno_id, payload, current_user, db) AlunoResponseSchema
            +delete_alunos(aluno_id, current_user, db) dict
        }
        class CursoRouter {
            <<Controller>>
            +read_cursos(current_user, db) list
            +read_curso(curso_id, current_user, db) CursoResponseSchema
            +create_cursos(payload, current_user, db) CursoResponseSchema
            +update_cursos(curso_id, payload, current_user, db) CursoResponseSchema
            +delete_cursos(curso_id, current_user, db) dict
        }
        class TurmaRouter {
            <<Controller>>
            +read_turmas(current_user, db) list
            +read_minhas_turmas(current_user, db) list
            +read_turma(turma_id, current_user, db) TurmaResponseSchema
            +create_turmas(payload, current_user, db) TurmaResponseSchema
            +update_turmas(turma_id, payload, current_user, db) TurmaResponseSchema
            +delete_turmas(turma_id, current_user, db) dict
        }
        class MatriculaRouter {
            <<Controller>>
            +read_matriculas(current_user, db) list
            +read_matriculas_by_professor(current_user, db) list
            +read_matricula(matricula_id, current_user, db) MatriculaResponseSchema
            +create_matriculas(payload, current_user, db) MatriculaResponseSchema
            +update_matriculas(matricula_id, payload, current_user, db) MatriculaResponseSchema
            +delete_matriculas(matricula_id, current_user, db) dict
        }
        class NotaRouter {
            <<Controller>>
            +create_notas(payload, current_user, db) list
            +read_notas_by_matricula(matricula_id, current_user, db) list
            +read_notas_by_turma(turma_id, prova?, current_user, db) list
            +read_media_turma(turma_id, current_user, db) MediaTurmaSchema
        }
        class PresencaRouter {
            <<Controller>>
            +create_presencas(payload, current_user, db) list
            +read_presencas_by_turma(turma_id, dataAula?, current_user, db) list
        }
        class UsuarioRouter {
            <<Controller>>
            +read_usuarios(current_user, db) list
            +read_usuario(usuario_id, current_user, db) UsuarioResponseSchema
            +create_usuarios(payload, current_user, db) UsuarioResponseSchema
            +update_usuarios(usuario_id, payload, current_user, db) UsuarioResponseSchema
            +delete_usuarios(usuario_id, current_user, db) dict
        }
        class PedidoRouter {
            <<Controller>>
            +read_pedidos(current_user, db) list
            +read_pedido(pedido_id, current_user, db) PedidoResponseSchema
            +create_pedidos(payload, current_user, db) PedidoResponseSchema
            +aprovar_pedido_endpoint(pedido_id, current_user, db) PedidoResponseSchema
            +comprar_pedido_endpoint(pedido_id, payload, current_user, db) PedidoResponseSchema
            +update_pedidos(pedido_id, payload, current_user, db) PedidoResponseSchema
            +entregar_pedido_endpoint(pedido_id, current_user, db) PedidoResponseSchema
            +delete_pedidos(pedido_id, current_user, db) dict
        }
        class EstoqueRouter {
            <<Controller>>
            +read_estoque(current_user, db) list
            +search_estoque(q, current_user, db) list
            +read_alertas_estoque(current_user, db) list
            +read_estoque_item(estoque_id, current_user, db) EstoqueResponseSchema
            +create_estoque_item(payload, current_user, db) EstoqueResponseSchema
            +update_estoque_item(estoque_id, payload, current_user, db) EstoqueResponseSchema
            +delete_estoque_item(estoque_id, current_user, db) dict
            +baixa_estoque_item(estoque_id, payload, current_user, db) EstoqueResponseSchema
        }
        class DashboardRouter {
            <<Controller>>
            +read_kpis(current_user, db) KpisResponse
            +read_charts_academico(current_user, db) ChartAcademicoResponse
            +read_charts_logistica(current_user, db) ChartLogisticaResponse
        }
        class HistoricoRouter {
            <<Controller>>
            +read_historico_by_matricula(matricula_id, current_user, db) HistoricoResponse
        }
    }

    %% ============================================================
    %% CORE - backend/app/core/
    %% ============================================================
    namespace core {

        class Settings {
            <<Configuration>>
            +app_name: str
            +database_url: str
            +secret_key: str
            +jwt_algorithm: str
            +access_token_expire_minutes: int
            +reset_token_expire_minutes: int
            +smtp_host: str ; +smtp_port: int
            +frontend_url: str
            +cors_origins: str
            +rate_limit_auth: str
            +get_cors_origin_list() list
        }

        class SecurityUtils {
            <<Utility>>
            +verify_password(plain, hash) bool
            +hash_password(password) str
            +create_access_token(subject, cargo, expires?) str
            +create_reset_token(email, expires?) str
            +decode_reset_token(token) dict
        }

        class AuthDependencies {
            <<Utility>>
            +get_current_user(authorization?) dict
            +verify_cargo(*cargos) callable
            +verify_director_role() dict
        }

        class RateLimiter {
            <<Infrastructure>>
            +limiter: Limiter
        }
    }

    %% ============================================================
    %% DB - backend/app/db/
    %% ============================================================
    namespace db {

        class Database {
            <<Infrastructure>>
            +engine: Engine
            +SessionLocal: sessionmaker
            +Base: declarative_base
            +get_db() Generator~Session~
        }
    }

    %% ============================================================
    %% SERVICES - backend/app/services/
    %% ============================================================
    namespace services {

        class AuthService {
            <<Service>>
            +authenticate_user(db, email, senha) Usuario
            +build_login_response(usuario) dict
            +process_forgot_password(db, email) str
            +process_reset_password(db, token, nova_senha, confirmar_senha) void
        }
        class AlunoService {
            <<Service>>
            +create_aluno(db, payload) Aluno
            +list_alunos(db) list~Aluno~
            +get_aluno_by_id(db, aluno_id) Aluno
            +update_aluno(db, aluno_id, payload) Aluno
            +delete_aluno(db, aluno_id) void
        }
        class CursoService {
            <<Service>>
            +create_curso(db, payload) Curso
            +list_cursos(db) list~Curso~
            +get_curso_by_id(db, curso_id) Curso
            +update_curso(db, curso_id, payload) Curso
            +delete_curso(db, curso_id) void
        }
        class TurmaService {
            <<Service>>
            +create_turma(db, payload) Turma
            +list_turmas(db) list~Turma~
            +list_turmas_by_professor(db, professor_id) list~Turma~
            +get_turma_by_id(db, turma_id) Turma
            +update_turma(db, turma_id, payload) Turma
            +delete_turma(db, turma_id) void
        }
        class MatriculaService {
            <<Service>>
            +create_matricula(db, payload) Matricula
            +list_matriculas(db) list~Matricula~
            +list_matriculas_by_professor(db, professor_id) list~Matricula~
            +get_matricula_by_id(db, matricula_id) Matricula
            +update_matricula(db, matricula_id, payload) Matricula
            +delete_matricula(db, matricula_id) void
        }
        class NotaService {
            <<Service>>
            +create_or_update_notas(db, payload) list~Nota~
            +list_notas_by_matricula(db, matricula_id) list~Nota~
            +list_notas_by_turma(db, turma_id, prova?) list~Nota~
            +calcular_media_por_prova(db, turma_id) list~MediaProvaSchema~
        }
        class PresencaService {
            <<Service>>
            +create_or_update_presencas(db, payload) list~Presenca~
            +list_presencas_by_turma(db, turma_id, data_aula?) list~Presenca~
        }
        class UsuarioService {
            <<Service>>
            +create_usuario(db, payload) Usuario
            +list_usuarios(db) list~Usuario~
            +get_usuario_by_id(db, usuario_id) Usuario
            +update_usuario(db, usuario_id, payload) Usuario
            +delete_usuario(db, usuario_id) void
        }
        class PedidoService {
            <<Service>>
            +create_pedido(db, payload, usuario_id) Pedido
            +list_pedidos(db) list~Pedido~
            +get_pedido_by_id(db, pedido_id) Pedido
            +aprovar_pedido(db, pedido_id) Pedido
            +comprar_pedido(db, pedido_id, payload) Pedido
            +update_pedido_status(db, pedido_id, payload) Pedido
            +entregar_pedido(db, pedido_id) Pedido
            +delete_pedido(db, pedido_id) void
        }
        class EstoqueService {
            <<Service>>
            +create_estoque(db, payload) Estoque
            +list_estoque(db) list~Estoque~
            +search_estoque_by_name(db, term) list~Estoque~
            +get_estoque_by_id(db, estoque_id) Estoque
            +update_estoque(db, estoque_id, payload) Estoque
            +delete_estoque(db, estoque_id) void
            +dar_baixa(db, estoque_id, quantidade, justificativa) Estoque
            +get_alertas(db) list~Estoque~
            +deduzir_por_pedido(db, pedido) void
        }
        class DashboardService {
            <<Service>>
            +get_kpis(db) dict
            +get_chart_academico(db) dict
            +get_chart_logistica(db) dict
        }
        class HistoricoService {
            <<Service>>
            +get_historico_by_matricula(db, matricula_id) dict
        }
        class EmailService {
            <<Service>>
            +send_reset_email(to_email, reset_token) void
        }
    }

    %% ============================================================
    %% CROSS-LAYER DEPENDENCIES
    %% ============================================================

    %% api/v1 --> services
    AuthRouter ..> AuthService
    AuthRouter ..> EmailService
    AlunoRouter ..> AlunoService
    CursoRouter ..> CursoService
    TurmaRouter ..> TurmaService
    MatriculaRouter ..> MatriculaService
    NotaRouter ..> NotaService
    PresencaRouter ..> PresencaService
    UsuarioRouter ..> UsuarioService
    PedidoRouter ..> PedidoService
    EstoqueRouter ..> EstoqueService
    DashboardRouter ..> DashboardService
    HistoricoRouter ..> HistoricoService

    %% api/v1 --> core
    AuthRouter ..> AuthDependencies
    AuthRouter ..> RateLimiter
    AlunoRouter ..> AuthDependencies
    CursoRouter ..> AuthDependencies
    TurmaRouter ..> AuthDependencies
    MatriculaRouter ..> AuthDependencies
    NotaRouter ..> AuthDependencies
    PresencaRouter ..> AuthDependencies
    UsuarioRouter ..> AuthDependencies
    PedidoRouter ..> AuthDependencies
    EstoqueRouter ..> AuthDependencies
    DashboardRouter ..> AuthDependencies
    HistoricoRouter ..> AuthDependencies

    %% services --> models
    AuthService ..> Usuario
    AlunoService ..> Aluno
    CursoService ..> Curso
    TurmaService ..> Turma
    TurmaService ..> Curso
    TurmaService ..> Usuario
    MatriculaService ..> Aluno
    MatriculaService ..> Turma
    NotaService ..> Nota
    NotaService ..> Matricula
    PresencaService ..> Presenca
    PresencaService ..> Matricula
    UsuarioService ..> Usuario
    PedidoService ..> Pedido
    PedidoService ..> ItemPedido
    EstoqueService ..> Estoque
    EstoqueService ..> MovimentacaoEstoque
    DashboardService ..> Turma
    DashboardService ..> Pedido
    DashboardService ..> Estoque
    DashboardService ..> Matricula
    HistoricoService ..> Matricula
    HistoricoService ..> Aluno
    HistoricoService ..> Turma
    HistoricoService ..> Nota
    HistoricoService ..> Presenca

    %% services --> db + core
    AuthService ..> Database
    AuthService ..> SecurityUtils
    AlunoService ..> Database
    CursoService ..> Database
    TurmaService ..> Database
    MatriculaService ..> Database
    NotaService ..> Database
    PresencaService ..> Database
    UsuarioService ..> Database
    PedidoService ..> Database
    EstoqueService ..> Database
    DashboardService ..> Database
    HistoricoService ..> Database
    EmailService ..> Settings

    %% core internal
    AuthDependencies ..> SecurityUtils
    AuthDependencies ..> Settings
    Database ..> Settings
```
