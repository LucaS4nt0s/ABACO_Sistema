import { Pool } from 'pg';

import { getEnv } from './env';

export const pool = new Pool({
  connectionString: getEnv().DATABASE_URL,
});
