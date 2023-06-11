import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { appPlugin } from './app-plugin';
import { AppRouter } from './app-router';
import { errorHandler } from './lib/error-handler';
import { Fastify } from './lib/fastify';

export class App {
  constructor(
    //
    private readonly fastify: Fastify,
    private readonly appRouter: AppRouter,
  ) {}

  /**
   * @link https://www.fastify.io/docs/latest/Guides/Plugins-Guide/#how-to-handle-encapsulation-and-distribution
   * @link https://github.com/fastify/fastify/issues/3863
   */
  init(): void {
    const { fastify, appRouter } = this;

    fastify.register(helmet).register(cors);
    fastify.register(appPlugin).register(appRouter.register);

    fastify.setErrorHandler(errorHandler(fastify));
  }

  getInstance(): Fastify {
    return this.fastify;
  }
}
