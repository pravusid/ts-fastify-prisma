import { FastifyInstance, RouteOptions } from 'fastify';
import cors from 'fastify-cors';
import helmet from 'fastify-helmet';
import { serializeError } from 'serialize-error';
import { PublicError } from './domain/public-error';
import RequestPlugin from './plugin';

export interface Routable {
  routes: RouteOptions[];
}

export class App {
  constructor(
    //
    private readonly server: FastifyInstance,
    private readonly routes: Routable[],
  ) {}

  init(): FastifyInstance {
    this.server.register(helmet).register(cors);
    this.server.register(RequestPlugin);

    this.server.register((app, opts, done) => {
      this.routes.forEach(({ routes }) => routes.forEach(r => app.route(r)));
      done();
    });

    this.server.setErrorHandler((error, request, response) => {
      const from = { ip: request.genuineIp };
      const serialized = serializeError(error);

      if (error instanceof PublicError) {
        this.server.log.info({ ...from, error: serialized });
        response.status(error.statusCode).send({ statusCode: error.statusCode, message: error.message });
      } else {
        this.server.log.error({ ...from, error: serialized });
        response.status(500).send({ statusCode: 500, message: 'Internal Error' });
      }
    });

    return this.server;
  }
}
