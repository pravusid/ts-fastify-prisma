import { Static, Type } from '@fastify/type-provider-typebox';
import { schema } from '../../lib/fastify';

export const postFindSchema = schema({
  params: Type.Object({ id: Type.Number() }),
});

export const postCreateSchema = schema({
  body: Type.Object({
    title: Type.String(),
    author: Type.String(),
    content: Type.String(),
  }),
});

export type PostCreateDto = Static<typeof postCreateSchema['body']>;
