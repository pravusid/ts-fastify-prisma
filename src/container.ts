import { PrismaClient } from '@prisma/client';
import { asClass, asValue, createContainer, Lifetime, listModules } from 'awilix';
import Fastify, { FastifyInstance } from 'fastify';
import { camelCase } from 'lodash';
import { App, Routable } from './app';
import { envs } from './config/environments';
import { prisma } from './config/prisma';

export namespace Container {
  const componentPath = {
    api: '**/api/**/*-api.js',
    service: '**/service/**/*-service.js',
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
      server: asValue(
        Fastify({
          logger: {
            level: envs.isProd ? 'info' : 'debug',
          },
        }),
      ),
      app: asClass(App, { lifetime: Lifetime.SINGLETON }),
      prisma: asValue(prisma),
    })
    .register({
      logger: asValue(instance.resolve<FastifyInstance>('server').log),
    })
    .register({
      routes: asValue(keys.api.map(key => instance.resolve<Routable>(key))),
    });

  export const create = async (): Promise<App> => {
    await instance.resolve<PrismaClient>('prisma').$connect();
    return instance.resolve<App>('app');
  };

  export const destroy = (): Promise<void> => instance.dispose();
}
