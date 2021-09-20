import GracefulServer from '@gquittet/graceful-server';
import { envs } from './config/environments';
import { Container } from './container';

async function bootstrap() {
  try {
    const { fastify } = await Container.create();

    const graceful = GracefulServer(fastify.server, {
      closePromises: [Container.destroy],
      timeout: 3_000,
    });

    graceful.on(GracefulServer.READY, () => {
      console.log('Server is ready');
    });
    graceful.on(GracefulServer.SHUTTING_DOWN, () => {
      console.log('Server is shutting down');
    });
    graceful.on(GracefulServer.SHUTDOWN, error => {
      console.log('Server is down', error);
    });

    await fastify.listen(envs.port, '0.0.0.0');
    graceful.setReady();
  } catch (error) {
    console.error('Fatal Error 🔥', error);
    setTimeout(() => process.exit(1), 0);
  }
}

bootstrap();
