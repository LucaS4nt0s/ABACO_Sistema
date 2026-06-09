import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.db.database import Base
from app.models.estoque import Estoque


@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:", echo=False)
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def estoque_item(db_session: Session) -> Estoque:
    item = Estoque(
        nome_item="Teste Item",
        quantidade_disponivel=100,
        unidade="un",
        estoque_minimo=10,
    )
    db_session.add(item)
    db_session.commit()
    db_session.refresh(item)
    return item
