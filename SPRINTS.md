# Sprints do Sistema de Gestão Acadêmica (ABACO)

## Estado atual

### Já realizado

- Estrutura Docker com `database`, `backend` e `frontend`
- Login no backend com JWT
- Login no frontend
- CRUD de usuários com acesso restrito à diretoria
- Base de autorização por cargo
- Banco PostgreSQL inicializado pelo `docker-compose.yml`

### Ainda pendente

- Health check `/api/health`
- Ajustes finais de segurança no fluxo de autenticação e autorização
- Consolidação dos módulos acadêmico, logístico e de dashboard
- Validações, testes e documentação final

---

## Sprint 1 — Fundação, autenticação e gestão de acesso

**Objetivo**: deixar a base de entrada do sistema pronta para uso seguro pela diretoria e pela equipe.

**Entregáveis**

- [x] `docker-compose.yml` com PostgreSQL, backend e frontend
- [x] Login funcional no backend com JWT
- [x] Login funcional no frontend
- [x] CRUD de usuários com acesso restrito à diretoria
- [x] Tela de gestão de usuários para a diretoria
- [ ] Endpoint `/api/health` retornando `{ "status": "ok" }`
- [ ] Revisar e corrigir o fluxo de edição de usuário para preservar o cargo selecionado
- [ ] Padronizar proteção de rotas no frontend com base no cargo do usuário
- [ ] Revisar endurecimento de segurança do login e da criação de usuários

**Definition of Done**

- O sistema sobe com `docker compose up`
- A diretoria consegue entrar, acessar a área administrativa e gerenciar usuários
- O backend responde ao health check

---

## Sprint 2 — Núcleo acadêmico

**Objetivo**: permitir o cadastro e a administração das entidades básicas do processo acadêmico.

**Entregáveis**

- [ ] Cadastro, edição, listagem e exclusão de alunos
- [ ] Cadastro, edição, listagem e exclusão de cursos
- [ ] Cadastro, edição, listagem e exclusão de turmas
- [ ] Regras de vínculo entre turma, curso e professor
- [ ] Telas de listagem e formulário no frontend para alunos, cursos e turmas

**Definition of Done**

- A equipe administrativa consegue manter os cadastros acadêmicos completos
- As relações básicas entre aluno, curso e turma ficam consistentes

---

## Sprint 3 — Matrículas, presença e notas

**Objetivo**: cobrir a operação diária das turmas.

**Entregáveis**

- [ ] Realizar matrícula de aluno em turma
- [ ] Controlar status da matrícula: ativa, concluída e cancelada
- [ ] Registrar presença por aula
- [ ] Consultar presença por turma
- [ ] Lançar notas por matrícula
- [ ] Consultar notas por matrícula
- [ ] Gerar histórico escolar

**Definition of Done**

- A operação acadêmica principal funciona de ponta a ponta
- Professores e equipe administrativa conseguem registrar e consultar os dados da turma

---

## Sprint 4 — Logística e estoque

**Objetivo**: organizar o fluxo de materiais e o controle do estoque.

**Entregáveis**

- [ ] Criar pedidos de materiais
- [ ] Listar pedidos
- [ ] Aprovar pedidos pela diretoria
- [ ] Marcar pedido como entregue
- [ ] Dar baixa no estoque
- [ ] Emitir alertas de estoque baixo

**Definition of Done**

- O fluxo de solicitação e aprovação de materiais funciona sem intervenção manual fora do sistema

---

## Sprint 5 — Dashboards, validações e fechamento

**Objetivo**: consolidar o sistema com visão gerencial e acabamento final.

**Entregáveis**

- [ ] Dashboard administrativo com indicadores principais
- [ ] Cards e gráficos para visão de alunos, turmas, matrículas, pedidos e estoque
- [ ] Validações finais de entrada em frontend e backend
- [ ] Tratamento de erros consistente
- [ ] Testes automatizados dos fluxos críticos
- [ ] Ajustes de documentação do projeto

**Definition of Done**

- A diretoria consegue acompanhar a operação por dashboards
- Os fluxos críticos estão cobertos por testes e documentação

