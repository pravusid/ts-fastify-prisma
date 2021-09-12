import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { BaseDto } from './dto/base-dto';
import { ClassType } from './types/ctor';

type PartialObject<T> = { [K in keyof T]?: string };

declare module 'fastify' {
  interface FastifyRequest {
    genuineIp: string;
    getParams<T extends string>(): PartialObject<T>;
    getStrictParams<T>(...paramName: (keyof T)[]): { [K in keyof T]: string };
    getQuery<T extends string>(): PartialObject<T>;
    getBody<T>(Ctor?: ClassType<T>): T;
  }
}

export type PluginOptions = { _pluginOptionsBrand: never };

const pluginCb: FastifyPluginCallback<PluginOptions> = (fastify, options, done) => {
  fastify.addHook('onRequest', (request, _, done) => {
    request.genuineIp = (request.headers['x-forwarded-for'] as string | undefined) ?? request.ip;

    request.getParams = <T>() => request.params as PartialObject<T>;

    request.getStrictParams = <T>(...paramNames: (keyof T)[]) => {
      const params = request.params as PartialObject<T>;
      paramNames.forEach(pn => {
        if (!params[pn]) {
          throw new Error(`path variable ${pn} is undefined`);
        }
      });
      return request.params as { [K in keyof T]: string };
    };

    request.getQuery = <T extends string>() => request.query as PartialObject<T>;

    request.getBody = <T>(Ctor?: ClassType<T>) => {
      const objLike = (Ctor ? Object.assign(new Ctor(), request.body) : request.body) as T;
      if (objLike instanceof BaseDto) {
        objLike.validate();
      }
      return objLike;
    };

    done();
  });

  done();
};

export default fp(pluginCb);
