## Contexto
Issue #22 - A diretoria precisa aprovar pedidos antes da entrega.

## Mudanças

### O que mudou

1. **ItemPedido agora tem `nomeItem` (texto livre)** — o professor digita o nome, não precisa selecionar do estoque
2. **`idItemEstoque` opcional** — a referência ao estoque é apenas informativa
3. **Formulário de criar pedido** — input de texto com dropdown que consulta o estoque (apenas referência)
4. **Compra com quantidade por item** — diretor clica em "Comprar", vê os itens com inputs de quantidade, define quanto comprar de cada
5. **Entrega cria estoque automaticamente** — usa o `nomeItem` para buscar ou criar o item no estoque
6. **Bugfix: ordem de inicialização** — `searchInputValues` movido pra antes do `form` para evitar tela branca

### Instruções pro banco (já executado)
```sql
ALTER TABLE itemPedido ADD COLUMN nomeItem TEXT;
ALTER TABLE itemPedido ALTER COLUMN idItemEstoque DROP NOT NULL;
```

### Acceptance Criteria
- [x] Aprovar pedido
- [x] Marcar pedido como entregue
- [x] Restringir aprovação à diretoria
- [x] Professor digita nome do item livremente
- [x] Diretor define quantidade na compra
- [x] Estoque é criado automaticamente na entrega
