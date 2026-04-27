export interface AppEnv {
  DATABASE_URL: string;
  JWT_SECRET: string;
  PORT: number;
}

function readRequiredEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;

  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getEnv(): AppEnv {
  const DATABASE_URL = readRequiredEnv(
    'DATABASE_URL',
    'postgres://postgres:postgres@database:5432/sga_abacos',
  );
  const JWT_SECRET = readRequiredEnv('JWT_SECRET');
  const portValue = readRequiredEnv('PORT', '3333');
  const PORT = Number(portValue);

  if (!Number.isInteger(PORT) || PORT <= 0) {
    throw new Error('PORT must be a positive integer');
  }

  return { DATABASE_URL, JWT_SECRET, PORT };
}
