# Docker Architecture

The entire system must run using Docker Compose.

The project should have three main services:

1. frontend
2. backend
3. database

---

## Services

### frontend

Technology:

- Next.js
- TypeScript
- TailwindCSS

Port:

3000

Depends on:

- backend

---

### backend

Technology:

- Node.js
- Express
- TypeScript

Port:

3333

Depends on:

- database

Environment variables:

DATABASE_URL
JWT_SECRET
PORT

---

### database

Technology:

- PostgreSQL

Port:

5432

Database name:

sga_abacos

User:

postgres

Password:

postgres

---

## Expected Commands

Start development environment:

docker compose up --build

Stop containers:

docker compose down

Reset database:

docker compose down -v
docker compose up --build

---

## Requirements

The agent must create all Docker-related files:

- docker-compose.yml
- backend/Dockerfile
- frontend/Dockerfile
- backend/.dockerignore
- frontend/.dockerignore
- .env.example