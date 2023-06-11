import _GracefulServer from '@gquittet/graceful-server';
import { defaultImport } from 'default-import';
import { envs } from './config/environments.js';
import { Container } from './container.js';

const GracefulServer = defaultImport(_GracefulServer);

async function bootstrap() {
  try {
    const app = await Container.initApp();
    const fastify = app.getInstance();

    const graceful = GracefulServer(fastify.server, {
      closePromises: [Container.destroyApp],
      timeout: 3_000,
    });

    graceful.on(GracefulServer.READY, () => {
      console.log('Server is ready');
    });
    graceful.on(GracefulServer.SHUTTING_DOWN, () => {
      console.log('Server is shutting down');
    });
    graceful.on(GracefulServer.SHUTDOWN, (error) => {
      console.log('Server is down', error);
    });

    await fastify.listen({ port: envs.port, host: '0.0.0.0' });

    graceful.setReady();
  } catch (error) {
    console.error('Fatal Error 🔥', error);
    setTimeout(() => process.exit(1), 0);
  }
}

bootstrap();
