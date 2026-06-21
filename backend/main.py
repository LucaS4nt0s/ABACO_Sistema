import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from sqlalchemy import text

from app.api.v1.alunos import router as alunos_router
from app.api.v1.auth import router as auth_router
from app.api.v1.cursos import router as cursos_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.estoque import router as estoque_router
from app.api.v1.historico import router as historico_router
from app.api.v1.matriculas import router as matriculas_router
from app.api.v1.notas import router as notas_router
from app.api.v1.pedidos import router as pedidos_router
from app.api.v1.presencas import router as presencas_router
from app.api.v1.turmas import router as turmas_router
from app.api.v1.usuarios import router as usuarios_router
from app.core.config import get_settings
from app.core.limiter import limiter
from app.db.database import SessionLocal, engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

app = FastAPI(
    title="SGA ABACO API",
    description="API do Sistema de Gestão Acadêmica da Associação ABACO. "
                "Gerencia alunos, cursos, turmas, matrículas, presenças, notas, "
                "histórico escolar, pedidos de material e estoque.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=[
        {"name": "auth", "description": "Autenticação — login, registro, recuperação de senha"},
        {"name": "alunos", "description": "Cadastro e gestão de alunos"},
        {"name": "cursos", "description": "Cadastro e gestão de cursos"},
        {"name": "turmas", "description": "Cadastro e gestão de turmas"},
        {"name": "matriculas", "description": "Matrícula de alunos em turmas"},
        {"name": "presencas", "description": "Registro e consulta de presenças"},
        {"name": "notas", "description": "Lançamento e consulta de notas e médias"},
        {"name": "historico", "description": "Geração de histórico escolar"},
        {"name": "usuarios", "description": "Gestão de usuários (restrito à diretoria)"},
        {"name": "dashboard", "description": "Indicadores e gráficos administrativos"},
        {"name": "estoque", "description": "Gestão de estoque e baixa de itens"},
        {"name": "pedidos", "description": "Pedidos de material — criar, aprovar, comprar, entregar"},
    ],
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception on %s %s: %s", request.method, request.url.path, exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Erro interno do servidor. Tente novamente mais tarde."},
    )


@app.on_event("startup")
def seed_admin_user():
    if settings.admin_seed_email and settings.admin_seed_password:
        from app.core.security import hash_password
        from app.models.usuario import Usuario

        db = SessionLocal()
        try:
            existing = db.query(Usuario).filter(Usuario.email == settings.admin_seed_email).first()
            if not existing:
                admin = Usuario(
                    nome="Administrador",
                    email=settings.admin_seed_email,
                    senha_hash=hash_password(settings.admin_seed_password),
                    cargo=1,
                )
                db.add(admin)
                db.commit()
                logger.info("Admin user seeded: %s", settings.admin_seed_email)
        finally:
            db.close()


app.include_router(alunos_router)
app.include_router(auth_router)
app.include_router(cursos_router)
app.include_router(dashboard_router)
app.include_router(estoque_router)
app.include_router(historico_router)
app.include_router(matriculas_router)
app.include_router(notas_router)
app.include_router(pedidos_router)
app.include_router(presencas_router)
app.include_router(turmas_router)
app.include_router(usuarios_router)


@app.get("/api/health")
def health_check():
    db_ok = False
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            db_ok = True
    except Exception:
        db_ok = False
    return {"status": "ok", "database": "connected" if db_ok else "disconnected"}


@app.get("/")
def read_root():
    return {"status": "API online e rodando perfeitamente"}
