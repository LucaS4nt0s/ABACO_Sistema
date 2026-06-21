# Plano Final de Acabamento — SGA ABACO

> Estado atual: ~90% do core funcional implementado. Este plano cobre o que falta para deixar o sistema "redondo".

---

## Diagnóstico rápido

| Área | Status |
|------|--------|
| Auth (JWT, roles, guards) | ✅ Completo |
| CRUD de usuários | ✅ Completo |
| CRUD de alunos, cursos, turmas | ✅ Completo |
| Matrículas | ✅ Completo |
| Presenças, notas, histórico | ✅ Completo |
| Pedidos de material + aprovação | ✅ Completo |
| Estoque + alertas | ✅ Completo |
| Dashboard admin | ✅ Completo |
| Infra (Alembic, .env, CORS) | ✅ Completo (Sprint 1) |
| PR #50 (auto-registro, recuperação senha, dashboard professor) | ✅ Mergeado (Sprint 2) |
| Segurança (rate limit, hardening) | ❌ Pendente (Sprint 3) |
| Testes automatizados | ❌ Muito pouco (Sprint 4) |
| Validação, UX e polimento | ❌ Pendente (Sprint 5) |
| Documentação e entrega | ❌ Pendente (Sprint 6) |

---

## Sprint 1 — Infraestrutura e correções críticas ✅

**Objetivo**: garantir que `docker compose up` funciona do zero e as credenciais não estão hardcoded.

- [x] 1.1 Corrigir `database-schema.sql` — é uma pasta vazia, deve ser o arquivo de `docs/architecture/database-schema.sql`
- [x] 1.2 Criar `.env.example` com todas as variáveis necessárias (DB, JWT, SMTP, CORS)
- [x] 1.3 Mover secrets do `docker-compose.yml` para variáveis de ambiente (`${JWT_SECRET}`, `${POSTGRES_PASSWORD}`)
- [x] 1.4 Configurar Alembic e gerar migration inicial a partir dos modelos atuais
- [x] 1.5 Remover auto-migration ad-hoc do `backend/main.py` (substituir pelo Alembic)
- [x] 1.6 Revisar CORS — permitir configuração por variável de ambiente

**Definition of Done**: `docker compose up --build` sobe com banco populado, sem secrets hardcoded, migrations versionadas. ✅ **PR #51 mergeado.**

---

## Sprint 2 — Merge e revisão do PR #50 (feat/49) ✅

**Objetivo**: revisar, testar e mergear o PR que implementa auto-cadastro de professor, recuperação de senha e dashboard do professor.

- [x] 2.1 Revisar código do backend: `auth.py`, `auth_service.py`, `email_service.py`, `security.py`
- [x] 2.2 Revisar código do frontend: `register`, `forgot-password`, `reset-password`, `academico-layout`, `turmas`
- [x] 2.3 Testar fluxo completo: auto-registro → login → dashboard professor → turmas
- [x] 2.4 Testar fluxo de recuperação de senha (token + reset)
- [x] 2.5 Verificar fallback de email no console quando SMTP não configurado
- [x] 2.6 Mergear `feat/49` → `dev`

**Definition of Done**: PR #50 aprovado e mergeado. Professor se auto-cadastra, recupera senha, vê dashboard e suas turmas. ✅ **PR #50 mergeado.**

---

## Sprint 3 — Segurança e hardening ✅

**Objetivo**: proteger a aplicação contra uso indevido e garantir boas práticas.

- [x] 3.1 Rate limiting nos endpoints de auth (`/login`, `/register`, `/forgot-password`, `/reset-password`)
- [x] 3.2 Validação de força de senha (mínimo 8 chars, letras + números)
- [x] 3.3 Corrigir fluxo de edição de usuário (preservar cargo selecionado ao editar) — **verificado: sem bug, cargo preservado corretamente**
- [x] 3.4 Padronizar proteção de rotas no frontend — todo `app.routes.ts` com guards adequados
- [x] 3.5 Revisar mensagens de erro — não vazar informação de estrutura interna
- [x] 3.6 Adicionar timeout de sessão / expiração de token configurável
- [x] 3.7 Verificar permissões por role em TODOS os endpoints do backend

**Definition of Done**: Auth protegido contra brute-force, senhas fortes exigidas, rotas blindadas por role, sem vazamento de info em erros. ✅ **PR #52 mergeado.**

---

## Sprint 4 — Testes automatizados

**Objetivo**: cobrir os fluxos críticos com testes de backend e frontend.

### Backend (pytest)
- [x] 4.1 Testes de auth service: login, register, forgot/reset password
- [x] 4.2 Testes de auth schema: validação de entradas
- [x] 4.3 Testes de aluno service: CRUD completo
- [x] 4.4 Testes de curso service: CRUD completo
- [x] 4.5 Testes de turma service: CRUD + vínculos
- [x] 4.6 Testes de matrícula service: matricular, status, duplicação, capacidade
- [x] 4.7 Testes de presença service: registro em lote, consulta por turma/data
- [x] 4.8 Testes de nota service: lançamento, médias, consulta por aluno/turma
- [x] 4.9 Testes de pedido service: criar, aprovar, comprar, entregar
- [x] 4.10 Testes de dashboard service: KPIs
- [x] 4.11 Testes de endpoints (integração): rotas principais com TestClient

### Frontend (Vitest)
- [x] 4.12 Testes do auth service: login, register, forgot/reset, token interceptor
- [x] 4.13 Testes dos guards restantes: directorGuard, adminGuard
- [x] 4.14 Testes de componente: tabela de alunos, formulário de curso
- [x] 4.15 Testes de serviço: aluno.service, curso.service, turma.service

**Definition of Done**: Cobertura > 60% nos fluxos críticos. `pytest` passa. `ng test` passa.

---

## Sprint 5 — Validação, UX e polimento

**Objetivo**: melhorar a experiência do usuário com feedbacks claros e consistência visual.

- [x] 5.1 Adicionar validação visual nos formulários (mensagens de erro inline, campos required)
- [x] 5.2 Padronizar tratamento de erros no frontend (toast/mensagem para erros 400, 401, 403, 500)
- [x] 5.3 Adicionar estados de loading (spinner/skeleton) em todas as listagens
- [x] 5.4 Adicionar estados de "vazio" (empty state) quando não há dados
- [x] 5.5 Adicionar confirmação antes de excluir (modal "tem certeza?")
- [x] 5.6 Responsividade — testar e corrigir em telas menores (tablet, mobile)
- [x] 5.7 Feedback de ações: toast de sucesso ao criar/editar/excluir
- [x] 5.8 Revisar acessibilidade básica (labels, contrastes, navegação por teclado)

**Definition of Done**: Todas as telas têm loading, empty state, validação inline, confirmação de exclusão e feedback de sucesso/erro.

---

## Sprint 6 — Documentação e entrega

**Objetivo**: deixar o projeto documentado e pronto para deploy e onboarding.

- [x] 6.1 Atualizar `PROGRESS.md` com status real
- [x] 6.2 Atualizar `SPRINTS.md` com status real ou remover em favor deste plano
- [x] 6.3 Adicionar descrições nos endpoints OpenAPI (summary/description nos routers)
- [x] 6.4 Criar guia de deploy (produção) em `docs/guides/deploy.md`
- [x] 6.5 Adicionar `LICENSE` (MIT conforme README)
- [x] 6.6 Corrigir template de issues (trocar "Simples Editor" por "ABACO")
- [x] 6.7 Verificar e atualizar `README.md` se necessário

**Definition of Done**: Projeto documentado, pronto para onboarding de novos devs e deploy em produção.

---

## Resumo

| Sprint | Foco | Issues estimadas | Status |
|--------|------|------------------|--------|
| Sprint 1 | Infra e correções críticas | 6 | ✅ Concluído |
| Sprint 2 | Merge PR #50 | 6 | ✅ Concluído |
| Sprint 3 | Segurança e hardening | 7 | ✅ Concluído |
| Sprint 4 | Testes automatizados | 15 | ✅ Concluído |
| Sprint 5 | Validação, UX e polimento | 8 | ✅ Concluído |
| Sprint 6 | Documentação e entrega | 7 | ✅ Concluído |
| **Total** | | **49 tarefas** | **49/49 concluídas** ✅ |
