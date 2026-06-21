from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
from app.db.database import engine

settings = get_settings()

app = FastAPI(title="SGA ABACO API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
