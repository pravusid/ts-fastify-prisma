import { asClass, asValue, createContainer, Lifetime, listModules } from 'awilix';
import Fastify, { FastifyInstance } from 'fastify';
import { camelCase } from 'lodash';
import { App } from './app';
import { AppRouter } from './app-router';
import { envs } from './config/environments';
import { prisma } from './infra/prisma';
import { ClassType } from './types/ctor';

export namespace Container {
  const componentPath = {
    api: 'dist/**/*-api.js',
    service: 'dist/**/*-service.js',
  };

  export const instance = createContainer({
    injectionMode: 'CLASSIC',
  }).loadModules(Object.values(componentPath), {
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

  export const initApp = async (): Promise<App> => {
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
