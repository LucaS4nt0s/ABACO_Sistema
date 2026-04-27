import { getEnv } from './config/env';
import { createApp } from './app';

export function startServer() {
  const { PORT } = getEnv();
  const app = createApp();

  return app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
  });
}

if (require.main === module) {
  startServer();
}
