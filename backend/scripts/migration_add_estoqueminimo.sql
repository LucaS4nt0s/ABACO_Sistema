-- Migration: Add estoqueMinimo column and movimentacao_estoque table
-- Run this manually against existing databases

ALTER TABLE estoque ADD COLUMN IF NOT EXISTS estoqueMinimo INTEGER;

CREATE TABLE IF NOT EXISTS movimentacao_estoque (
    idMovimentacao SERIAL PRIMARY KEY,
    idItemEstoque INTEGER REFERENCES estoque(idItemEstoque),
    quantidade INTEGER NOT NULL,
    tipoMovimentacao TEXT NOT NULL,
    justificativa TEXT,
    dataMovimentacao TIMESTAMP NOT NULL
);
