import { route } from '../lib/fastify.js';

export class PingApi {
  ping = route({
    method: 'GET',
    url: '/ping',
    handler: () => {
      return { message: 'pong' };
    },
  });
}

export default PingApi;
