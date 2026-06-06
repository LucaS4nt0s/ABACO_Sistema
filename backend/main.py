from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.v1.alunos import router as alunos_router
from app.api.v1.auth import router as auth_router
from app.api.v1.usuarios import router as usuarios_router
from app.db.database import engine

app = FastAPI(title="SGA ABACO API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:4200",
        "http://127.0.0.1:4200",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(alunos_router)
app.include_router(auth_router)
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