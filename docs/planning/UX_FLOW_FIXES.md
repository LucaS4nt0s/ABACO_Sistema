# Plano de Correções de Fluxo de Usuário — SGA ABACO

> Análise completa do fluxo de navegação, autorização e experiência por role.
> Baseado no documento [`PLANO_FINAL.md`](./PLANO_FINAL.md) que cobriu infra, segurança, testes, UX e documentação.
> Este plano foca exclusivamente em **fluxos confusos, páginas quebradas e dead ends**.

---

## Diagnóstico rápido por role

| Role | Login redirect | Menu funcional? | Páginas quebradas | Pode acessar área errada? |
|------|---------------|-----------------|-------------------|--------------------------|
| **Diretor** (1) | `/admin/home` | ✅ Completo | Nenhuma | ⚠️ Acessa `/academico` (área do professor) |
| **Admin** (3) | `/admin/home` | ✅ Completo (sem Dashboard/Usuários) | Nenhuma | ❌ Bloqueado do `/academico` |
| **Professor** (2) | `/academico/home` | 🔴 3 de 4 links são stubs | Alunos, Presenças, Notas | ❌ Bloqueado do `/admin` |

---

## Sprint 7 — Correções de fluxo e navegação

### 7.1 🔴 Página 403 "Acesso Negado"

**Problema**: Todo guard que falha (`roleGuard`, `adminGuard`, `directorGuard`) redireciona para `/login` com `router.parseUrl('/login')`. Um usuário autenticado que tenta acessar rota sem permissão é jogado na tela de login sem nenhuma explicação.

**Comportamento atual**:
- Admin acessa `/admin/dashboard` → redirecionado silenciosamente para `/login`
- Professor acessa `/admin/alunos` → mesma coisa
- Usuário vê a tela de login e acha que foi deslogado

**Correção proposta**:
- Criar página `AccessDeniedComponent` com mensagem clara e botão de voltar
- Alterar `roleGuard` para redirecionar a `/acesso-negado` em vez de `/login` quando usuário está autenticado mas sem permissão
- Adicionar suporte na rota `app.routes.ts`:
  ```typescript
  { path: 'acesso-negado', loadComponent: () => import('./features/errors/pages/access-denied/access-denied').then(m => m.AccessDenied) }
  ```

**Arquivos afetados**: `role.guard.ts`, `app.routes.ts`, novo componente `AccessDenied`

**Esforço**: Médio (2-3h)

---

### 7.2 🔴 Implementar páginas do Professor (alunos, presenças, notas)

**Problema**: A área do professor (`/academico`) tem 4 links no menu lateral. Apenas **1 funciona** (`/academico/turmas`). Os outros 3 são stubs (placeholder "Funcionalidade em desenvolvimento").

**Comportamento atual**:
- `/academico/alunos` → `<p>Funcionalidade em desenvolvimento.</p>`
- `/academico/presencas` → `<p>Funcionalidade em desenvolvimento.</p>`
- `/academico/notas` → `<p>Funcionalidade em desenvolvimento.</p>`

**Correção proposta**:

#### 7.2a — `AlunosPage` (listar alunos das turmas do professor)
- Usar `turmaService.listMine()` para obter turmas do professor
- Usar `matriculaService.list()` para obter matrículas dessas turmas
- Mostrar tabela com: nome do aluno, turma, telefone
- Backend: criar endpoint `GET /api/v1/alunos/me` ou filtrar por turmas do professor

#### 7.2b — `PresencasPage` (registrar presenças nas turmas do professor)
- Reaproveitar o componente `AttendanceListComponent` da área admin
- Adaptar para usar as turmas do professor (`turmaService.listMine()`)
- Seletor de turma (só turmas do professor) + seletor de data
- Grid de presença com toggle

#### 7.2c — `NotasPage` (lançar notas nas turmas do professor)
- Reaproveitar o componente `GradesListComponent` da área admin
- Adaptar para usar as turmas do professor
- Seletor de turma + seletor de prova
- Grid de notas com input numérico

**Arquivos afetados**: `alunos.ts/html`, `presencas.ts/html`, `notas.ts/html` (todos em `/academico/pages/`), possivelmente novos endpoints no backend

**Esforço**: Médio (4-5h)

---

### 7.3 🔴 Auto-logout não redireciona para `/login`

**Problema**: Quando o token JWT expira (via `scheduleAutoLogout`), o `AuthService.logout()` limpa o estado e o token, mas **não navega para `/login`**. O usuário fica na mesma página. A próxima chamada de API retorna 401 e só mostra um toast de erro.

**Comportamento atual**:
```typescript
// auth.service.ts — scheduleAutoLogout()
this.tokenExpiryTimer = setTimeout(() => {
  this.logout();  // limpa token e estado, mas NÃO navega
}, remainingMs);
```

**Correção proposta**:
- Injetar `Router` no `AuthService` (ou emitir evento)
- No `scheduleAutoLogout`, navegar para `/login` após limpar estado:
  ```typescript
  this.tokenExpiryTimer = setTimeout(() => {
    this.logout();
    this.router.navigate(['/login']);
  }, remainingMs);
  ```
- O interceptor de erro 401 também deve limpar token e redirecionar

**Arquivos afetados**: `auth.service.ts`, `error.interceptor.ts`

**Esforço**: Baixo (30min)

---

### 7.4 🟡 Remover acesso do Diretor à área `/academico`

**Problema**: O `roleGuard([1, 2])` no parent `/academico` permite Diretores (cargo 1) acessarem a área do professor. Isso cria dois problemas:
1. Diretor vê "Minhas Turmas" com turmas atribuídas a ele como professor (provavelmente nenhuma)
2. Os mesmos nomes de página existem em `/admin/*` e `/academico/*` com implementações diferentes

**Correção proposta**:
- Alterar `roleGuard([1, 2])` para `roleGuard([2])` no `academico.routes.ts`
- Se um Diretor precisar ver a visão do professor, pode logar como professor

**Arquivos afetados**: `academico.routes.ts`

**Esforço**: Baixo (5min)

---

### 7.5 🟡 Adicionar breadcrumbs nas páginas profundas

**Problema**: Páginas aninhadas não têm indicação de hierarquia:
- `/admin/matriculas/:id/notas` — sem breadcrumb, sem botão voltar
- `/admin/notas/aluno/:id` — mesma coisa
- `/admin/historico/matricula/:id` — mesma coisa

**Correção proposta**:
- Criar componente `BreadcrumbComponent` simples
- Exibir no topo da página: `Admin > Matrículas > Notas do Aluno`
- Usar `ActivatedRoute` para construir a trilha automaticamente
- Adicionar às 3 páginas profundas

**Arquivos afetados**: Novo componente `breadcrumb`, 3 páginas de detalhe

**Esforço**: Médio (2h)

---

### 7.6 🟢 Adicionar link "Logístico" no menu lateral admin

**Problema**: A página `/admin/logistico` existe com cards de navegação mas **não tem link no menu lateral**. É inacessível via navegação normal.

**Correção proposta**:
- Adicionar `<a routerLink="/admin/logistico">` no `admin-layout.html` na seção "Logistico", antes de Estoque e Pedidos
- Ou tornar o label "Logístico" clicável como link pai

**Arquivos afetados**: `admin-layout.html`

**Esforço**: Baixo (10min)

---

### 7.7 🟢 Remover código morto

**Problema**: `logistico.routes.ts` define rotas standalone (`/logistico/*`) que nunca são importadas em `app.routes.ts`. É código órfão que confunde.

**Correção proposta**:
- Deletar o arquivo `frontend/src/app/features/logistico/logistico.routes.ts`
- Verificar se nenhuma importação o referencia

**Arquivos afetados**: `logistico.routes.ts`

**Esforço**: Baixo (5min)

---

### 7.8 🟢 Limpar guard redundante em `/admin/usuarios`

**Problema**: A rota `/admin/usuarios` usa `canActivate: [adminGuard, directorGuard]`. Como ambos precisam passar, e `directorGuard` já restringe a cargo 1, o `adminGuard` (que permite 1 e 3) é redundante.

**Correção proposta**:
- Alterar para `canActivate: [directorGuard]` apenas

**Arquivos afetados**: `admin.routes.ts`

**Esforço**: Baixo (5min)

---

## ▶️ Bônus: Melhorias que surgiram da análise

### B1 🟡 Login pós-401 não redireciona
O `error.interceptor.ts` captura 401 e mostra toast, mas não limpa token nem redireciona. O usuário fica numa página quebrada com erro.

**Correção**: Se o erro for 401, chamar `auth.logout()` e `router.navigate(['/login'])` no interceptor.

### B2 🟢 Wildcard `**` deveria mostrar 404
A rota wildcard atual redireciona para `/login`. Seria melhor uma página 404 amigável.

**Correção**: Criar `NotFoundComponent` e usar no `**`.

---

## Resumo das issues

| # | Issue | Severidade | Esforço |
|---|-------|-----------|---------|
| 7.1 | Página 403 "Acesso Negado" | 🔴 Crítico | Médio |
| 7.2 | Páginas do Professor (3 stubs) | 🔴 Crítico | Médio |
| 7.3 | Auto-logout sem redirecionamento | 🔴 Crítico | Baixo |
| 7.4 | Diretor acessa área do professor | 🟡 Importante | Baixo |
| 7.5 | Breadcrumbs em páginas profundas | 🟡 Importante | Médio |
| 7.6 | Link "Logístico" no menu lateral | 🟢 Menor | Baixo |
| 7.7 | Remover código morto | 🟢 Menor | Baixo |
| 7.8 | Guard redundante em /usuarios | 🟢 Menor | Baixo |
| B1 | 401 no interceptor → logout | 🟡 Importante | Baixo |
| B2 | Página 404 amigável | 🟢 Menor | Baixo |

**Total: 10 issues, ~8-10h estimadas**
