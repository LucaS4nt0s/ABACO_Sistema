# Arquitetura do Sistema


## Frontend

Framework: Next.js  
Linguagem: TypeScript  
UI: TailwindCSS

Responsabilidades:

- interface administrativa
- interface de professor
- dashboards

---

## Backend

Runtime: Node.js  
Framework: Express

Responsabilidades:

- API REST
- autenticação
- regras de negócio

---

## Banco de Dados

Banco: PostgreSQL

Hospedagem recomendada:

Supabase ou Railway

---

## Autenticação

JWT

Papéis:

- diretora
- administrativo
- professor

---

## Deploy

Frontend: Vercel  
Backend: Railway ou Render  
Banco: Supabase

Custo estimado:

R$0 – R$40 mês

## Docker

The system must be fully containerized.

Development should run with:

docker compose up --build

The system must include:

- PostgreSQL container
- Express backend container
- Next.js frontend container

The backend must connect to PostgreSQL using:

postgres://postgres:postgres@database:5432/sga_abacos

The frontend must call the backend through:

http://localhost:3333