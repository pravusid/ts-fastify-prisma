import { FastifyPluginCallback } from 'fastify';
import { PingApi } from './api/ping-api.js';
import { PostApi } from './api/post-api.js';
import { Fastify, FastifyRoute } from './lib/fastify.js';

export class AppRouter {
  constructor(
    private readonly pingApi: PingApi,
    private readonly postApi: PostApi,
  ) {}

  register: FastifyPluginCallback = (instance, opts, done) => {
    this.applyRoutes(instance, this.pingApi);
    this.applyRoutes(instance, this.postApi);

    done();
  };

  private applyRoutes = (instance: Fastify, api: object): void => {
    Object.values(api).forEach((e) => {
      if (e instanceof FastifyRoute) {
        instance.route(e);
      }
    });
  };
}

export default AppRouter;
