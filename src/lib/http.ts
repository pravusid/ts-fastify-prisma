import { FastifyReply, onSendHookHandler } from 'fastify';

export namespace HTTP {
  export const onSendHandler: (tasks: ((reply: FastifyReply) => void)[]) => onSendHookHandler<unknown> =
    tasks => (request, reply, payload, done) => {
      tasks.forEach(t => {
        t(reply);
      });
      done();
    };

  export const setStatus: (statusCode: number) => (reply: FastifyReply) => void = statusCode => reply => {
    reply.status(statusCode);
  };
}
