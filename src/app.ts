import Fastify, { RouteOptions } from 'fastify';
import cors from 'fastify-cors';
import helmet from 'fastify-helmet';
import { serializeError } from 'serialize-error';
import { PublicError } from './domain/public-error';
import RequestPlugin from './plugin';

export interface Routable {
  routes: RouteOptions[];
}

export class App {
  readonly fastify = Fastify({ logger: true });

  private isKeepAliveDisabled = false;

  constructor(private readonly routes: Routable[]) {
    const { fastify } = this;

    fastify.register(helmet).register(cors);
    fastify.register(RequestPlugin);

    fastify.addHook('onRequest', (_, response, done) => {
      if (this.isKeepAliveDisabled) {
        response.header('Connection', 'close');
      }
      done();
    });

    fastify.register((app, opts, done) => {
      this.routes.forEach(({ routes }) => routes.forEach(r => app.route(r)));
      done();
    });

    fastify.setErrorHandler((error, request, response) => {
      const from = { ip: request.genuineIp };
      const serialized = serializeError(error);

      if (error instanceof PublicError) {
        fastify.log.info({ ...from, error: serialized });
        response.status(error.statusCode).send({ statusCode: error.statusCode, message: error.message });
      } else {
        fastify.log.error({ ...from, error: serialized });
        response.status(500).send({ statusCode: 500, message: 'Internal Error' });
      }
    });

    fastify.addHook('onClose', (_, done) => {
      this.isKeepAliveDisabled = true;
      done();
    });
  }
}
