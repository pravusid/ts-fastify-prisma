import { asClass, asValue, createContainer, Lifetime, listModules } from 'awilix';
import Fastify, { FastifyInstance } from 'fastify';
import { camelCase } from 'lodash-es';
import { AppRouter } from './app-router.js';
import { App } from './app.js';
import { envs } from './config/environments.js';
import { prisma } from './infra/prisma.js';
import { ClassType } from './types.js';

export namespace Container {
  const componentPath = {
    api: 'dist/**/*-api.js',
    service: 'dist/**/*-service.js',
  };

  const instance = createContainer({
    injectionMode: 'CLASSIC',
  });

  export const initApp = async (): Promise<App> => {
    await instance.loadModules(Object.values(componentPath), {
      esModules: true,
      formatName: 'camelCase',
      resolverOptions: {
        lifetime: Lifetime.SINGLETON,
        register: asClass,
      },
    });

    instance
      .register({
        fastify: asValue(
          Fastify({
            logger: { level: envs.isProd ? 'info' : 'debug' },
          }),
        ),
      })
      .register({
        logger: asValue(instance.resolve<FastifyInstance>('fastify').log),
        prisma: asValue(prisma),
      })
      .register({
        app: asClass(App, { lifetime: Lifetime.SINGLETON }),
        appRouter: asClass(AppRouter, { lifetime: Lifetime.SINGLETON }),
      })
      .register({
        apis: asValue(
          listModules(componentPath.api).map((e) => {
            return instance.resolve<ClassType<unknown>>(camelCase(e.name));
          }),
        ),
      });

    const app = instance.resolve<App>('app');

    await Promise.all([
      /* initialization */
      app.init(),
    ]);

    return app;
  };

  export const destroyApp = async (): Promise<void> => {
    await Promise.all([
      /* cleanup */
    ]);
  };
}
