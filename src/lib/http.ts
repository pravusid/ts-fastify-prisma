import { FastifyReply, onSendHookHandler } from 'fastify';

export namespace HTTP {
  export const onSendHandler: (tasks: ((reply: FastifyReply) => void)[]) => onSendHookHandler<unknown> =
    (tasks) => (request, reply, payload, done) => {
      tasks.forEach((t) => {
        t(reply);
      });
      done();
    };

  export const onSendSetStatus = (statusCode: number): onSendHookHandler<unknown> =>
    onSendHandler([
      (reply) => {
        if (reply.statusCode === 200) {
          reply.status(statusCode);
        }
      },
    ]);
}
