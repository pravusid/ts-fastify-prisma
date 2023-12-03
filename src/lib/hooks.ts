import { FastifyHooks } from './fastify.js';

export namespace Hooks {
  export const onSendSetStatusCode = (statusCode: number) =>
    FastifyHooks.onSendHandler((request, reply, payload, done) => {
      if (reply.statusCode === 200) {
        reply.status(statusCode);
      }
      done();
    });
}
