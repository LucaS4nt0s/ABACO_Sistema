CREATE TABLE aluno (
    idAluno SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    telefone TEXT,
    nascimento DATE,
    rua TEXT,
    bairro TEXT,
    numero INTEGER
);

CREATE TABLE curso (
    idCurso SERIAL PRIMARY KEY,
    nomeCurso TEXT NOT NULL
);

CREATE TABLE usuario (
    idUsuario SERIAL PRIMARY KEY,
    nome TEXT,
    telefone TEXT,
    email TEXT UNIQUE,
    senhaHash TEXT,
    cargo INTEGER
);

CREATE TABLE turma (
    idTurma SERIAL PRIMARY KEY,
    capacidade INTEGER,
    dataInicio DATE,
    dataFim DATE,
    idCurso INTEGER REFERENCES curso(idCurso),
    idProfessor INTEGER REFERENCES usuario(idUsuario)
);

CREATE TABLE matricula (
    idMatricula SERIAL PRIMARY KEY,
    idAluno INTEGER REFERENCES aluno(idAluno),
    idTurma INTEGER REFERENCES turma(idTurma),
    dataMatricula DATE,
    status INTEGER
);

CREATE TABLE presenca (
    idPresenca SERIAL PRIMARY KEY,
    idMatricula INTEGER REFERENCES matricula(idMatricula),
    dataAula DATE,
    presente BOOLEAN
);

CREATE TABLE nota (
    idNota SERIAL PRIMARY KEY,
    nota FLOAT,
    prova INTEGER,
    idMatricula INTEGER REFERENCES matricula(idMatricula)
);

CREATE TABLE estoque (
    idItemEstoque SERIAL PRIMARY KEY,
    nomeItem TEXT,
    quantidadeDisponivel INTEGER,
    unidade TEXT
);

CREATE TABLE pedido (
    idPedido SERIAL PRIMARY KEY,
    idUsuario INTEGER REFERENCES usuario(idUsuario),
    idTurma INTEGER REFERENCES turma(idTurma),
    dataPedido DATE,
    status INTEGER
);

CREATE TABLE itemPedido (
    idItemPedido SERIAL PRIMARY KEY,
    idPedido INTEGER REFERENCES pedido(idPedido),
    idItemEstoque INTEGER REFERENCES estoque(idItemEstoque),
    quantidade INTEGER,
    precoUnitario FLOAT
);