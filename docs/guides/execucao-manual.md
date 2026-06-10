# Execução manual do projeto

Este guia mostra como subir e verificar o ABACO localmente usando Docker Compose.

## Pré-requisitos

- Docker Desktop instalado e aberto
- Node.js 20+ instalado
- npm disponível no terminal

## 1. Instale as dependências

Na raiz do projeto:

```bash
npm install
```

## 2. Configure as variáveis de ambiente

Copie o arquivo de exemplo:

```powershell
Copy-Item .env.example .env
```

Se estiver usando CMD:

```bat
copy .env.example .env
```

Se quiser alterar a senha do JWT, edite o valor de `JWT_SECRET` no `.env`.

## 3. Suba os containers

Execute:

```bash
docker compose up --build
```

O comando inicia:

- PostgreSQL em `localhost:5432`
- backend em `http://localhost:8000`
- frontend em `http://localhost:3000`

## 4. Acesse a aplicação

Abra no navegador:

- `http://localhost:3000` para o frontend
- `http://localhost:8000/api/auth/login` para a API de login

## 5. Pare o ambiente

Para encerrar os containers:

```bash
docker compose down
```

Para remover também os dados do banco:

```bash
docker compose down -v
```

## Observação importante

O banco é iniciado com o schema, mas os usuários precisam ser cadastrados manualmente para o login funcionar.

Para criar ou atualizar o usuário administrador localmente, defina `ADMIN_SEED_EMAIL` e `ADMIN_SEED_PASSWORD` no arquivo `.env` do backend e execute no diretório `backend`:

```powershell
.\venv\Scripts\python.exe scripts\seed_admin.py
```

O script também aceita os argumentos `--nome`, `--email`, `--telefone`, `--senha`, `--hash` e `--cargo` para sobrescrever os valores do `.env`.
