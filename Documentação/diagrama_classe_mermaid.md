```mermaid
classDiagram

    %% ============================================================
    %% MODEL - backend/app/models/
    %% ============================================================
    namespace Model {
        class Aluno {
            <<Entity>>
            -id_aluno: int (PK)
            -nome: str (NOT NULL)
            -telefone: str?
            -data_nascimento: date?
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
        }
        class Curso { <<Entity>> -id_curso: int (PK) ; -nome_curso: str (NOT NULL) ; +get_id_curso() int ; +get_nome_curso() str }
        class Turma {
            <<Entity>>
            -id_turma: int (PK) ; -capacidade: int?
            -data_inicio: date? ; -data_fim: date?
            -id_curso: int (FK) ; -id_professor: int? (FK)
            -dias_aula: str? ; -avaliacoes: list? (JSONB)
            +vagas_ocupadas: int (readonly)
            +get_id_turma() int ; +get_capacidade() int?
            +get_data_inicio() date? ; +get_data_fim() date?
            +get_id_curso() int ; +get_id_professor() int?
            +get_dias_aula() str? ; +get_avaliacoes() list?
            +get_vagas_ocupadas() int
        }
        class Matricula { <<Entity>> -id_matricula: int (PK) ; -id_aluno: int (FK) ; -id_turma: int (FK) ; -data_matricula: date? ; -status: int? ; +get_id_matricula() int ; +get_id_aluno() int ; +get_id_turma() int ; +get_data_matricula() date? ; +get_status() int? }
        class Nota { <<Entity>> -id_nota: int (PK) ; -nota: float? ; -prova: int? ; -id_matricula: int (FK) ; +get_id_nota() int ; +get_nota() float? ; +get_prova() int? ; +get_id_matricula() int }
        class Presenca { <<Entity>> -id_presenca: int (PK) ; -id_matricula: int (FK) ; -data_aula: date? ; -presente: bool? ; +get_id_presenca() int ; +get_id_matricula() int ; +get_data_aula() date? ; +get_presente() bool? }
        class Usuario { <<Entity>> -id_usuario: int (PK) ; -nome: str? ; -telefone: str? ; -email: str? (UNIQUE) ; -senha_hash: str? ; -cargo: int? ; +get_id_usuario() int ; +get_nome() str? ; +get_telefone() str? ; +get_email() str? ; +get_senha_hash() str? ; +get_cargo() int? }
        class Pedido { <<Entity>> -id_pedido: int (PK) ; -id_usuario: int (FK) ; -id_turma: int (FK) ; -data_pedido: date? ; -status: int? ; +get_id_pedido() int ; +get_id_usuario() int ; +get_id_turma() int ; +get_data_pedido() date? ; +get_status() int? }
        class ItemPedido { <<Entity>> -id_item_pedido: int (PK) ; -id_pedido: int (FK) ; -id_item_estoque: int? (FK) ; -nome_item: str? ; -quantidade: int? ; -preco_unitario: float? ; +get_id_item_pedido() int ; +get_id_pedido() int ; +get_id_item_estoque() int? ; +get_nome_item() str? ; +get_quantidade() int? ; +get_preco_unitario() float? }
        class Estoque { <<Entity>> -id_item_estoque: int (PK) ; -nome_item: str? ; -quantidade_disponivel: int? ; -unidade: str? ; -estoque_minimo: int? ; +get_id_item_estoque() int ; +get_nome_item() str? ; +get_quantidade_disponivel() int? ; +get_unidade() str? ; +get_estoque_minimo() int? }
        class MovimentacaoEstoque { <<Entity>> -id_movimentacao: int (PK) ; -id_item_estoque: int (FK) ; -quantidade: int ; -tipo_movimentacao: str ; -justificativa: str? ; -data_movimentacao: datetime ; +get_id_movimentacao() int ; +get_id_item_estoque() int ; +get_quantidade() int ; +get_tipo_movimentacao() str ; +get_justificativa() str? ; +get_data_movimentacao() datetime }

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
    %% SCHEMA - backend/app/schemas/
    %% ============================================================
    namespace Schema {
        class AlunoResponseSchema { <<DTO>> +id_aluno (alias idAluno): int ; +nome: str ; +telefone: str? ; +data_nascimento (alias dataNascimento): date? ; +rua: str? ; +bairro: str? ; +numero: int? }
        class CursoResponseSchema { <<DTO>> +id_curso (alias idCurso): int ; +nome_curso (alias nomeCurso): str }
        class TurmaResponseSchema { <<DTO>> +id_turma (alias idTurma): int ; +capacidade: int? ; +data_inicio (alias dataInicio): date? ; +data_fim (alias dataFim): date? ; +id_curso (alias idCurso): int ; +id_professor (alias idProfessor): int? ; +dias_aula (alias diasAula): str? ; +vagas_ocupadas (alias vagasOcupadas): int? ; +avaliacoes: list? ; +curso: TurmaCursoInfo? ; +professor: TurmaProfessorInfo? }
        class MatriculaResponseSchema { <<DTO>> +id_matricula (alias idMatricula): int ; +id_aluno (alias idAluno): int? ; +id_turma (alias idTurma): int? ; +data_matricula (alias dataMatricula): date? ; +status: int? ; +aluno: MatriculaAlunoInfo? ; +turma: MatriculaTurmaInfo? }
        class NotaResponseSchema { <<DTO>> +id_nota (alias idNota): int ; +id_matricula (alias idMatricula): int ; +nota: float? ; +prova: int? ; +matricula: NotaMatriculaInfo? }
        class PresencaResponseSchema { <<DTO>> +id_presenca (alias idPresenca): int ; +id_matricula (alias idMatricula): int ; +data_aula (alias dataAula): date? ; +presente: bool? ; +matricula: PresencaMatriculaInfo? }
        class UsuarioResponseSchema { <<DTO>> +id_usuario (alias idUsuario): int ; +nome: str? ; +telefone: str? ; +email: EmailStr? ; +cargo: int? }
        class PedidoResponseSchema { <<DTO>> +id_pedido (alias idPedido): int ; +id_usuario (alias idUsuario): int ; +id_turma (alias idTurma): int ; +data_pedido (alias dataPedido): date? ; +status: int? ; +usuario: UsuarioPedidoInfo? ; +turma: TurmaPedidoInfo? ; +itens: list[ItemPedidoResponseSchema]? }
        class EstoqueResponseSchema { <<DTO>> +id_item_estoque (alias idItemEstoque): int ; +nome_item (alias nomeItem): str? ; +quantidade_disponivel (alias quantidadeDisponivel): int? ; +unidade: str? ; +estoque_minimo (alias estoqueMinimo): int? }
        class TokenResponse { <<DTO>> +access_token: str ; +token_type: str = "bearer" ; +usuario: UsuarioResponse }
        class KpisResponse { <<DTO>> +total_alunos_ativos: int ; +total_turmas_vigentes: int ; +total_pedidos_pendentes: int ; +total_estoque_critico: int }
        class ChartAcademicoResponse { <<DTO>> +alunos_por_curso: list[AlunosPorCurso] ; +status_matriculas: list[StatusMatriculas] }
        class ChartLogisticaResponse { <<DTO>> +consumo_mes_atual: list[ConsumoItem] }
        class HistoricoResponse { <<DTO>> +id_matricula (alias idMatricula): int ; +data_matricula (alias dataMatricula): date? ; +status: int? ; +aluno: HistoricoAlunoInfo ; +turma: HistoricoTurmaInfo ; +notas: list[HistoricoNotaInfo] ; +presencas: list[HistoricoPresencaInfo] ; +percentual_frequencia (alias percentualFrequencia): float? }

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
    }

    %% ============================================================
    %% CONTROLLER - backend/app/api/v1/
    %% ============================================================
    namespace Controller {
        class AuthRouter { +login(LoginRequest) TokenResponse ; +forgot_password(ForgotPasswordRequest) MessageResponse ; +reset_password(ResetPasswordRequest) MessageResponse }
        class AlunoRouter { +read_alunos() list~AlunoResponseSchema~ ; +read_aluno(id) AlunoResponseSchema ; +create_alunos(AlunoCreateSchema) AlunoResponseSchema ; +update_alunos(id, AlunoUpdateSchema) AlunoResponseSchema ; +delete_alunos(id) dict }
        class CursoRouter { +read_cursos() list~CursoResponseSchema~ ; +read_curso(id) CursoResponseSchema ; +create_cursos(CursoCreateSchema) CursoResponseSchema ; +update_cursos(id, CursoUpdateSchema) CursoResponseSchema ; +delete_cursos(id) dict }
        class TurmaRouter { +read_turmas() list~TurmaResponseSchema~ ; +read_minhas_turmas() list~TurmaResponseSchema~ ; +read_turma(id) TurmaResponseSchema ; +create_turmas(TurmaCreateSchema) TurmaResponseSchema ; +update_turmas(id, TurmaUpdateSchema) TurmaResponseSchema ; +delete_turmas(id) dict }
        class MatriculaRouter { +read_matriculas() list~MatriculaResponseSchema~ ; +read_matriculas_by_professor() list~MatriculaResponseSchema~ ; +read_matricula(id) MatriculaResponseSchema ; +create_matriculas(MatriculaCreateSchema) MatriculaResponseSchema ; +update_matriculas(id, MatriculaUpdateSchema) MatriculaResponseSchema ; +delete_matriculas(id) dict }
        class NotaRouter { +create_notas(NotaBatchSchema) list~NotaResponseSchema~ ; +read_notas_by_matricula(id) list~NotaResponseSchema~ ; +read_notas_by_turma(id, prova?) list~NotaResponseSchema~ ; +read_media_turma(id) MediaTurmaSchema }
        class PresencaRouter { +create_presencas(PresencaBatchSchema) list~PresencaResponseSchema~ ; +read_presencas_by_turma(id, dataAula?) list~PresencaResponseSchema~ }
        class UsuarioRouter { +read_usuarios() list~UsuarioResponseSchema~ ; +read_usuario(id) UsuarioResponseSchema ; +create_usuarios(UsuarioCreateSchema) UsuarioResponseSchema ; +update_usuarios(id, UsuarioUpdateSchema) UsuarioResponseSchema ; +delete_usuarios(id) dict }
        class PedidoRouter { +read_pedidos() list~PedidoResponseSchema~ ; +read_pedido(id) PedidoResponseSchema ; +create_pedidos(PedidoCreateSchema) PedidoResponseSchema ; +aprovar_pedido_endpoint(id) PedidoResponseSchema ; +comprar_pedido_endpoint(id, PedidoCompraSchema) PedidoResponseSchema ; +update_pedidos(id, PedidoUpdateSchema) PedidoResponseSchema ; +entregar_pedido_endpoint(id) PedidoResponseSchema ; +delete_pedidos(id) dict }
        class EstoqueRouter { +read_estoque() list~EstoqueResponseSchema~ ; +search_estoque(q) list~EstoqueResponseSchema~ ; +read_alertas_estoque() list~EstoqueAlertaResponseSchema~ ; +read_estoque_item(id) EstoqueResponseSchema ; +create_estoque_item(EstoqueCreateSchema) EstoqueResponseSchema ; +update_estoque_item(id, EstoqueUpdateSchema) EstoqueResponseSchema ; +delete_estoque_item(id) dict ; +baixa_estoque_item(id, EstoqueBaixaSchema) EstoqueResponseSchema }
        class DashboardRouter { +read_kpis() KpisResponse ; +read_charts_academico() ChartAcademicoResponse ; +read_charts_logistica() ChartLogisticaResponse }
        class HistoricoRouter { +read_historico_by_matricula(id) HistoricoResponse }
    }

    %% ============================================================
    %% SERVICE - backend/app/services/
    %% ============================================================
    namespace Service {
        class AuthService { +authenticate_user(db, email, senha) Usuario ; +build_login_response(usuario) dict ; +process_forgot_password(db, email) str ; +process_reset_password(db, token, novaSenha, confirmarSenha) void }
        class AlunoService { +create_aluno(db, payload) Aluno ; +list_alunos(db) list~Aluno~ ; +get_aluno_by_id(db, id) Aluno ; +update_aluno(db, id, payload) Aluno ; +delete_aluno(db, id) void }
        class CursoService { +create_curso(db, payload) Curso ; +list_cursos(db) list~Curso~ ; +get_curso_by_id(db, id) Curso ; +update_curso(db, id, payload) Curso ; +delete_curso(db, id) void }
        class TurmaService { #_resolve_curso(db, cursoId) void ; #_resolve_professor(db, profId) void ; +create_turma(db, payload) Turma ; +list_turmas(db) list~Turma~ ; +list_turmas_by_professor(db, profId) list~Turma~ ; +get_turma_by_id(db, id) Turma ; +update_turma(db, id, payload) Turma ; +delete_turma(db, id) void }
        class MatriculaService { #_resolve_aluno(db, alunoId) void ; #_resolve_turma(db, turmaId) void ; #_check_turma_lotada(db, turmaId) void ; #_get_turma_curso_id(db, turmaId) int ; #_check_matricula_duplicada(db, alunoId, turmaId, excludeId?) void ; +create_matricula(db, payload) Matricula ; +list_matriculas(db) list~Matricula~ ; +list_matriculas_by_professor(db, profId) list~Matricula~ ; +get_matricula_by_id(db, id) Matricula ; +update_matricula(db, id, payload) Matricula ; +delete_matricula(db, id) void }
        class NotaService { +create_or_update_notas(db, payload) list~Nota~ ; +list_notas_by_matricula(db, id) list~Nota~ ; +list_notas_by_turma(db, id, prova?) list~Nota~ ; +calcular_media_por_prova(db, turmaId) list~MediaProvaSchema~ }
        class PresencaService { +create_or_update_presencas(db, payload) list~Presenca~ ; +list_presencas_by_turma(db, id, data?) list~Presenca~ }
        class UsuarioService { +create_usuario(db, payload) Usuario ; +list_usuarios(db) list~Usuario~ ; +get_usuario_by_id(db, id) Usuario ; +update_usuario(db, id, payload) Usuario ; +delete_usuario(db, id) void }
        class PedidoService { #_resolve_turma(db, turmaId) void ; +create_pedido(db, payload, userId) Pedido ; +list_pedidos(db) list~Pedido~ ; +get_pedido_by_id(db, id) Pedido ; +aprovar_pedido(db, id) Pedido ; +comprar_pedido(db, id, payload) Pedido ; +update_pedido_status(db, id, payload) Pedido ; +entregar_pedido(db, id) Pedido ; +delete_pedido(db, id) void }
        class EstoqueService { +create_estoque(db, payload) Estoque ; +list_estoque(db) list~Estoque~ ; +search_estoque_by_name(db, term) list~Estoque~ ; +get_estoque_by_id(db, id) Estoque ; +update_estoque(db, id, payload) Estoque ; +delete_estoque(db, id) void ; +dar_baixa(db, id, qtd, just) Estoque ; +get_alertas(db) list~Estoque~ ; +deduzir_por_pedido(db, pedido) void }
        class DashboardService { +get_kpis(db) dict ; +get_chart_academico(db) dict ; +get_chart_logistica(db) dict }
        class HistoricoService { #_calculate_frequencia(presencas) float? ; +get_historico_by_matricula(db, id) dict }
        class EmailService { +send_reset_email(to_email, reset_token) void }
    }

    %% ============================================================
    %% CORE - backend/app/core/ + db/
    %% ============================================================
    namespace Core {
        class Settings { <<Config>> +app_name: str ; +database_url: str ; +secret_key: str ; +jwt_algorithm: str ; +access_token_expire_minutes: int ; +reset_token_expire_minutes: int ; +frontend_url: str ; +get_cors_origin_list() list~str~ }
        class SecurityUtils { <<Utility>> +verify_password(plain, hash) bool ; +hash_password(password) str ; +create_access_token(subject, cargo, expires?) str ; +create_reset_token(email, expires?) str ; +decode_reset_token(token) dict }
        class AuthDependencies { <<Utility>> +get_current_user(authorization?) dict ; +verify_cargo(*cargos) callable ; +verify_director_role() dict }
        class Database { <<Infrastructure>> +engine: Engine ; +SessionLocal: sessionmaker ; +Base: declarative_base ; +get_db() Session }
    }

    %% ============================================================
    %% VIEW - frontend/src/app/
    %% ============================================================
    namespace View {
        class LoginPage { <<Component>> -email: string ; -senha: string ; -lembrar: bool ; +onSubmit() void ; +redirectByRole(cargo) void }
        class ForgotPasswordPage { <<Component>> -email: string ; +onSubmit() void }
        class ResetPasswordPage { <<Component>> -token: string ; -novaSenha: string ; -confirmarSenha: string ; +onSubmit() void }
        class AdminHome { <<Component>> -kpis: any ; -chartAcademico: any ; -chartLogistica: any ; -alertasCount: number ; +loadKpis() void ; +loadCharts() void }
        class StudentsManagementComponent { <<Component>> -alunos: any[] ; -searchTerm: string ; +loadAlunos() void ; +save(data) void ; +confirmDelete(id) void }
        class CoursesManagementComponent { <<Component>> -cursos: any[] ; +loadCursos() void ; +save(data) void ; +confirmDelete(id) void }
        class ClassesManagementComponent { <<Component>> -turmas: any[] ; -cursos: any[] ; -professores: any[] ; +loadTurmas() void ; +duplicate(id) void ; +delete(id) void }
        class EnrollmentsManagementComponent { <<Component>> -matriculas: any[] ; -alunos: any[] ; -turmas: any[] ; +loadMatriculas() void ; +save(data) void ; +confirmDelete(id) void ; +onViewTranscript(id) void }
        class GradesManagementComponent { <<Component>> -turmaId: number ; -prova: number ; -notas: any[] ; -medias: any ; +loadNotas(turmaId, prova) void ; +saveNotas(payload) void ; +loadMedia(turmaId) void }
        class AttendanceManagementComponent { <<Component>> -turmaId: number ; -dataAula: string ; -presencas: any[] ; +loadPresencas(turmaId, data) void ; +savePresencas(payload) void ; +togglePresenca(alunoId) void }
        class EstoqueManagementComponent { <<Component>> -itens: any[] ; -searchTerm: string ; -alertas: any[] ; +loadEstoque() void ; +search(query) void ; +save(data) void ; +openBaixaForm(item) void }
        class PedidoListComponent { <<Component>> -pedidos: any[] ; -activeTab: string ; +loadPedidos() void ; +aprovar(id) void ; +comprar(id, payload) void ; +entregar(id) void }
        class UsersManagementComponent { <<Component>> -usuarios: any[] ; +loadUsuarios() void ; +save(data) void ; +confirmDelete(id) void }
        class TranscriptViewComponent { <<Component>> -historico: any ; +loadHistorico(id) void ; +exportPDF() void }
        class AcademicoHome { <<Component>> -totalTurmas: number ; -totalAlunos: number ; +loadData() void }
        class TurmaDetailPage { <<Component>> -turma: any ; -alunos: any[] ; +loadTurma(id) void ; +loadAlunos() void }
        class PedidoFormPageComponent { <<Component>> -turmas: any[] ; -itens: any[] ; +save(payload) void }
        class AccessDenied { <<Component>> }
        class NotFound { <<Component>> }

        class AlunoService { <<Service>> +list() Observable~Aluno[]~ ; +create(payload) Observable~Aluno~ ; +update(id, payload) Observable~Aluno~ ; +delete(id) Observable~dict~ }
        class AuthService { <<Service>> +login(email, password) Observable~TokenResponse~ ; +forgotPassword(email) Observable~MessageResponse~ ; +resetPassword(token, novaSenha, confirm) Observable~MessageResponse~ ; +logout() void ; +isAuthenticated() bool }
        class TurmaService { <<Service>> +list() Observable~Turma[]~ ; +listMine() Observable~Turma[]~ ; +getById(id) Observable~Turma~ ; +create(payload) Observable~Turma~ ; +update(id, payload) Observable~Turma~ ; +delete(id) Observable~dict~ }
        class MatriculaService { <<Service>> +list() Observable~Matricula[]~ ; +listMine() Observable~Matricula[]~ ; +create(payload) Observable~Matricula~ ; +update(id, payload) Observable~Matricula~ ; +delete(id) Observable~dict~ }
        class NotaService { <<Service>> +listByTurma(id, prova?) Observable~Nota[]~ ; +listByMatricula(id) Observable~Nota[]~ ; +create(payload) Observable~Nota[]~ ; +getMediaTurma(id) Observable~MediaTurma~ }
        class PresencaService { <<Service>> +listByTurma(id, data?) Observable~Presenca[]~ ; +create(payload) Observable~Presenca[]~ }
        class EstoqueService { <<Service>> +list() Observable~Estoque[]~ ; +search(q) Observable~Estoque[]~ ; +create(payload) Observable~Estoque~ ; +update(id, payload) Observable~Estoque~ ; +delete(id) Observable~dict~ ; +baixa(id, payload) Observable~Estoque~ ; +getAlertas() Observable~EstoqueAlerta[]~ }
        class DashboardService { <<Service>> +getKpis() Observable~Kpis~ ; +getChartAcademico() Observable~ChartAcademico~ ; +getChartLogistica() Observable~ChartLogistica~ }
        class NotificationService { <<Service>> +error(message) void ; +success(message) void ; +clear() void }
        class DialogService { <<Service>> +confirm(options) Observable~bool~ }

        class AuthGuard { <<Guard>> +canActivate() bool }
        class RoleGuard { <<Guard>> +canActivate(allowedCargos: int[]) bool }
        class TokenInterceptor { <<Interceptor>> +intercept(req, next) HttpEvent }
        class ErrorInterceptor { <<Interceptor>> +intercept(req, next) HttpEvent }
    }
```
