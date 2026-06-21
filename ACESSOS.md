# Acessos e Dados de Teste — SGA ABACO

## Logins

| Cargo | Email | Senha |
|-------|-------|-------|
| **Diretora** | admin@abaco.org.br | admin123 |
| **Professora** | maria@abaco.org.br | prof12345 |
| **Professor** | joao@abaco.org.br | prof12345 |
| **Professora** | ana@abaco.org.br | prof12345 |

> Para criar um Administrativo (cargo 3), a Diretora pode cadastrar via `/admin/usuarios`.

---

## Dados populados (seed automático)

### Cursos
| Nome |
|------|
| Informática Básica |
| Corte e Costura |
| Administração |

### Turmas
| # | Curso | Professor | Capacidade | Período | Dias | Avaliações |
|---|-------|-----------|-----------|---------|------|------------|
| 1 | Informática Básica | Maria Silva | 20 vagas | 01/06 a 30/09/2026 | Seg/Qua/Sex | Prova 1 (10) + Prova 2 (10) + Trabalho Final (10) |
| 2 | Informática Básica | Maria Silva | 25 vagas | 01/08 a 15/12/2026 | Ter/Qui | Prova 1 (10) + Prova 2 (10) |
| 3 | Corte e Costura | João Santos | 15 vagas | 01/05 a 30/08/2026 | Seg/Qua/Sex | Prova Única (10) + Trabalho Prático (10) |
| 4 | Administração | Ana Costa | 30 vagas | 01/07 a 30/10/2026 | Ter/Qui/Sáb | Prova 1 (10) + Prova 2 (10) + Prova 3 (10) + Prova 4 (10) |

### Alunos (8)
Pedro Alves, Carla Mendes, Lucas Oliveira, Juliana Freitas, Rafael Souza, Beatriz Lima, Gabriel Torres, Mariana Rocha

### Matrículas (8)
Distribuídas entre as 4 turmas.

### Estoque
| Item | Disponível | Mínimo | Alerta? |
|------|-----------|--------|---------|
| Caneta esferográfica | 200 un | 50 | Não |
| Caderno universitário | 80 un | 20 | Não |
| **Lápis HB** | **5 un** | 30 | **🔴 Sim** |
| Borracha branca | 60 un | 15 | Não |
| Papel sulfite A4 | 12 resmas | 5 | Não |
| **Tesoura escolar** | **3 un** | 10 | **🔴 Sim** |

---

## Como testar

1. **Diretora**: loga com `admin@abaco.org.br` / `admin123`
   - Vê o dashboard na home com KPIs e gráficos
   - Acessa Turmas → vê os cards agrupados por curso
   - Gerencia alunos, matrículas, usuários
   - Aprova pedidos, vê estoque crítico

2. **Professor**: loga com `maria@abaco.org.br` / `prof12345`
   - Vê dashboard do professor
   - Acessa "Minhas Turmas" → vê 2 turmas de Informática
   - Registra presenças e notas

3. **Email de recuperação**: ao usar "Esqueci minha senha", o link aparece no log do container:
   ```bash
   docker logs sga_backend | grep ABACO
   ```
