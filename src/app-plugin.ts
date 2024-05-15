import type { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyRequest {
    genuineIp: string;
  }
}

export type PluginOptions = { _pluginOptionsBrand: never };

const pluginCb: FastifyPluginCallback<PluginOptions> = (fastify, options, done) => {
  fastify.addHook('onRequest', (request, _, done) => {
    request.genuineIp = (request.headers['x-forwarded-for'] as string | undefined) ?? request.ip;

    done();
  });

  done();
};

export const appPlugin = fp(pluginCb);
