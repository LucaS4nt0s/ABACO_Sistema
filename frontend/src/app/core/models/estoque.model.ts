export interface Estoque {
  idItemEstoque: number;
  nomeItem: string | null;
  quantidadeDisponivel: number | null;
  unidade: string | null;
}

export interface EstoqueCreatePayload {
  nomeItem: string;
  quantidadeDisponivel: number | null;
  unidade: string | null;
}

export interface EstoqueUpdatePayload {
  nomeItem: string | null;
  quantidadeDisponivel: number | null;
  unidade: string | null;
}
