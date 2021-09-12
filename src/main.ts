import { envs } from './config/environments';
import { Container } from './container';

async function bootstrap() {
  const app = await Container.create();
  const server = app.init();

  server.listen(envs.port, '0.0.0.0', err => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
  });
}

bootstrap();
