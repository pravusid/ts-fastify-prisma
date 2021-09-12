import { RouteOptions } from 'fastify';
import { Routable } from '../app';

export default class PingApi implements Routable {
  readonly routes: RouteOptions[] = [];

  constructor() {
    this.routes.push(this.ping);
  }

  private ping: RouteOptions = {
    method: 'GET',
    url: '/ping',
    handler: async (req, resp) => {
      resp.send({ message: 'pong' });
    },
  };
}
