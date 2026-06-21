# Sprints do Sistema de Gestão Acadêmica (ABACO)

> **Nota**: Este documento foi o plano inicial de sprints. O acompanhamento real e atualizado está em [`PLANO_FINAL.md`](./PLANO_FINAL.md).

---

## Resultado final — Todas as metas atingidas ✅

### Módulo Acadêmico
- ✅ CRUD de alunos, cursos, turmas
- ✅ Matrículas com validação de duplicidade e capacidade
- ✅ Registro de presença por turma/data (batch)
- ✅ Lançamento de notas por prova (batch)
- ✅ Médias por turma e prova
- ✅ Histórico escolar completo

### Módulo Logístico
- ✅ CRUD de estoque com estoque mínimo
- ✅ Alertas de estoque baixo
- ✅ Baixa manual de estoque
- ✅ Criação de pedidos com itens
- ✅ Fluxo de aprovação (solicitado → aprovado → comprado → entregue)
- ✅ Dedução automática do estoque na aprovação

### Módulo Administrativo
- ✅ Dashboard com KPIs e gráficos (ApexCharts)
- ✅ Gestão de usuários (restrito à diretoria)
- ✅ Autenticação JWT com controle de cargo (Diretor, Professor, Administrativo)

### Área do Professor
- ✅ Auto-cadastro com cargo fixo (Professor)
- ✅ Recuperação de senha (token JWT + email)
- ✅ Dashboard do professor com cards de atalho
- ✅ Listagem de turmas atribuídas ao professor

### Infraestrutura e Segurança
- ✅ Docker Compose com 3 serviços + health checks
- ✅ Alembic para migrations versionadas
- ✅ `.env.example` com todas variáveis
- ✅ Rate limiting nos endpoints de auth (slowapi)
- ✅ Validação de força de senha (letras + números)
- ✅ CORS configurável por ambiente
- ✅ Exception handler global (sem vazamento de erros)
- ✅ Confirmação customizada (DialogService) em vez de `confirm()` nativo
- ✅ NotificationService com success/error + auto-dismiss
- ✅ Testes automatizados (~107 casos: pytest + Vitest)
