import { randomUUID } from 'node:crypto';
import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { serializeError } from 'serialize-error';
import { PublicError } from '../domain/public-error.js';
import type { Fastify } from './fastify.js';

export const errorHandler =
  (fastify: Fastify) =>
  (error: FastifyError | Error, request: FastifyRequest, reply: FastifyReply): FastifyReply => {
    const from = { ip: request.genuineIp };
    const serialized = serializeError(error);

    // https://github.com/fastify/fastify/issues/4605
    if ('code' in error && error.code === 'FST_ERR_VALIDATION') {
      fastify.log.debug({ ...from, error: serialized });
      return reply.status(400).send({
        statusCode: error.statusCode,
        code: error.code,
        error: 'Bad Request',
        message: error.message,
      });
    }

    if (error instanceof PublicError) {
      fastify.log.debug({ ...from, error: serialized });
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: 'Public Error',
        message: error.message,
      });
    }

    const errorId = randomUUID();
    fastify.log.error({ ...from, errorId, error: serialized });
    return reply.status(500).send({
      statusCode: 500,
      error: 'Internal Error',
      message: errorId,
    });
  };
