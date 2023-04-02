import { asClass, asValue, createContainer, Lifetime, listModules } from 'awilix';
import Fastify, { FastifyInstance } from 'fastify';
import { camelCase } from 'lodash';
import { App, Routable } from './app';
import { envs } from './config/environments';
import { prisma } from './config/prisma';

export namespace Container {
  const componentPath = {
    api: '**/*-api.js',
    service: '**/*-service.js',
  };

  const keys = {
    api: listModules(componentPath.api).map(e => camelCase(e.name)),
    service: listModules(componentPath.service).map(e => camelCase(e.name)),
  };

  export const instance = createContainer({ injectionMode: 'CLASSIC' }).loadModules([...Object.values(componentPath)], {
    cwd: __dirname,
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
          logger: {
            level: envs.isProd ? 'info' : 'debug',
          },
        }),
      ),
    })
    .register({
      logger: asValue(instance.resolve<FastifyInstance>('fastify').log),
    })
    .register({
      app: asClass(App, { lifetime: Lifetime.SINGLETON }),
      prisma: asValue(prisma),
    })
    .register({
      routables: asValue(keys.api.map(key => instance.resolve<Routable>(key))),
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
