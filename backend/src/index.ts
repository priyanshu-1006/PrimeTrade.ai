import app from './app';
import { env } from './config/env';

const start = async () => {
  try {
    console.log('╔══════════════════════════════════════════╗');
    console.log('║      🚀 PrimeTrade.ai API Server         ║');
    console.log('╠══════════════════════════════════════════╣');

    app.listen(env.PORT, () => {
      console.log(`║  Environment : ${env.NODE_ENV.padEnd(24)}║`);
      console.log(`║  Port        : ${String(env.PORT).padEnd(24)}║`);
      console.log(`║  Frontend    : ${env.FRONTEND_URL.padEnd(24)}║`);
      console.log('╠══════════════════════════════════════════╣');
      console.log('║  Endpoints:                              ║');
      console.log('║    POST   /api/v1/auth/register           ║');
      console.log('║    POST   /api/v1/auth/login              ║');
      console.log('║    POST   /api/v1/auth/refresh            ║');
      console.log('║    POST   /api/v1/auth/logout             ║');
      console.log('║    GET    /api/v1/auth/profile            ║');
      console.log('║    GET    /api/v1/signals                 ║');
      console.log('║    GET    /api/v1/signals/:id             ║');
      console.log('║    POST   /api/v1/signals        (Admin)  ║');
      console.log('║    PATCH  /api/v1/signals/:id    (Admin)  ║');
      console.log('║    DELETE /api/v1/signals/:id    (Admin)  ║');
      console.log('╚══════════════════════════════════════════╝');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
