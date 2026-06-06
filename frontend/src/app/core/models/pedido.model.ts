export interface EstoqueItemInfo {
  idItemEstoque: number;
  nomeItem: string | null;
  unidade: string | null;
}

export interface ItemPedido {
  idItemPedido: number;
  idPedido: number;
  idItemEstoque: number;
  quantidade: number | null;
  precoUnitario: number | null;
  itemEstoque: EstoqueItemInfo | null;
}

export interface UsuarioPedidoInfo {
  idUsuario: number;
  nome: string | null;
}

export interface TurmaPedidoInfo {
  idTurma: number;
  capacidade: number | null;
}

export interface Pedido {
  idPedido: number;
  idUsuario: number;
  idTurma: number;
  dataPedido: string | null;
  status: number | null;
  usuario: UsuarioPedidoInfo | null;
  turma: TurmaPedidoInfo | null;
  itens: ItemPedido[] | null;
}

export interface ItemPedidoCreatePayload {
  idItemEstoque: number;
  quantidade: number | null;
  precoUnitario: number | null;
}

export interface PedidoCreatePayload {
  idTurma: number;
  dataPedido: string | null;
  itens: ItemPedidoCreatePayload[];
}

export interface PedidoUpdatePayload {
  status: number;
}
