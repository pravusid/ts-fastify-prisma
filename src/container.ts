import { Lifetime, asClass, asValue, createContainer, listModules } from 'awilix';
import Fastify, { type FastifyInstance } from 'fastify';
import { camelCase } from 'lodash-es';
import { AppRouter } from './app-router.js';
import { App } from './app.js';
import { envs } from './config/environments.js';
import { prisma } from './infra/prisma.js';
import type { ClassType } from './types.js';

export class Container {
  private readonly componentPath = {
    api: 'dist/**/*-api.js',
    service: 'dist/**/*-service.js',
  };

  private readonly instance = createContainer({
    injectionMode: 'CLASSIC',
  });

  async initApp(): Promise<App> {
    await this.instance.loadModules(Object.values(this.componentPath), {
      esModules: true,
      formatName: 'camelCase',
      resolverOptions: {
        lifetime: Lifetime.SINGLETON,
        register: asClass,
      },
    });

    this.instance
      .register({
        fastify: asValue(
          Fastify({
            logger: { level: envs.isProd ? 'info' : 'debug' },
          }),
        ),
      })
      .register({
        logger: asValue(this.instance.resolve<FastifyInstance>('fastify').log),
        prisma: asValue(prisma),
      })
      .register({
        app: asClass(App, { lifetime: Lifetime.SINGLETON }),
        appRouter: asClass(AppRouter, { lifetime: Lifetime.SINGLETON }),
      })
      .register({
        apis: asValue(
          listModules(this.componentPath.api).map((e) => {
            return this.instance.resolve<ClassType<unknown>>(camelCase(e.name));
          }),
        ),
      });

    const app = this.instance.resolve<App>('app');

    await Promise.all([
      /* initialization */
      app.init(),
    ]);

    return app;
  }

  async destroyApp(): Promise<void> {
    await Promise.all([
      /* cleanup */
    ]);
  }
}
