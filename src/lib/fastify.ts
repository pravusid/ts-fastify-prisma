import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type {
  ContextConfigDefault,
  FastifyBaseLogger,
  FastifyInstance,
  FastifySchema,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteGenericInterface,
  RouteOptions,
} from 'fastify';

/**
 * @see https://www.fastify.io/docs/latest/Reference/Type-Providers/#type-definition-of-fastifyinstance--typeprovider
 */
export type Fastify = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyBaseLogger,
  TypeBoxTypeProvider
>;

export interface FastifyRouteOptions<SchemaCompiler extends FastifySchema = FastifySchema>
  extends RouteOptions<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    RouteGenericInterface,
    ContextConfigDefault,
    SchemaCompiler,
    TypeBoxTypeProvider
  > {
  __route?: boolean;
}

export class FastifyRouteOptions {
  __route?: boolean = true;
}

export const schema = <SchemaCompiler extends FastifySchema>(payload: SchemaCompiler): SchemaCompiler => payload;

export const route = <SchemaCompiler extends FastifySchema>(
  opts: FastifyRouteOptions<SchemaCompiler>,
): FastifyRouteOptions<SchemaCompiler> => Object.assign(new FastifyRouteOptions(), opts);
