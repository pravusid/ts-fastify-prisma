import type { FastifyPluginCallback } from 'fastify';
import type { PingApi } from './api/ping-api.js';
import type { PostApi } from './api/post-api.js';
import { type Fastify, FastifyRoute } from './lib/fastify.js';

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
    for (const e of Object.values(api)) {
      if (e instanceof FastifyRoute) {
        instance.route(e);
      }
    }
  };
}

export default AppRouter;
