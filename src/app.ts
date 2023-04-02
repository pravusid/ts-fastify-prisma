import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { FastifyInstance, RouteOptions } from 'fastify';
import { serializeError } from 'serialize-error';
import { PublicError } from './domain/public-error';
import RequestPlugin from './plugin';

export interface Routable {
  routes: RouteOptions[];
}

export class App {
  constructor(private readonly fastify: FastifyInstance, private readonly routables: Routable[]) {}

  async init(): Promise<void> {
    const { fastify, routables } = this;

    await fastify.register(helmet).register(cors);
    await fastify.register(RequestPlugin);

    await fastify.register((app, opts, done) => {
      routables.forEach(({ routes }) => routes.forEach(rt => app.route(rt)));
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
  }

  getInstance(): FastifyInstance {
    return this.fastify;
  }
}
