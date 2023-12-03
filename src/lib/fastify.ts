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
  onSendHookHandler,
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
  > {}

export class FastifyRoute {
  static [Symbol.hasInstance](value: unknown): value is FastifyRouteOptions {
    return Object.getPrototypeOf(value) === FastifyRoute.prototype;
  }

  static create<const SchemaCompiler extends FastifySchema>(
    opts: FastifyRouteOptions<SchemaCompiler>,
  ): FastifyRouteOptions<SchemaCompiler> {
    return Object.assign(new FastifyRoute(), opts);
  }

  private constructor() {}
}

export const schema = <const SchemaCompiler extends FastifySchema>(payload: SchemaCompiler): SchemaCompiler => payload;

export const route = <const SchemaCompiler extends FastifySchema>(
  opts: FastifyRouteOptions<SchemaCompiler>,
): FastifyRouteOptions<SchemaCompiler> => FastifyRoute.create(opts);

export namespace FastifyHooks {
  export type OnSendHander<SchemaCompiler extends FastifySchema = FastifySchema> = onSendHookHandler<
    unknown,
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    RouteGenericInterface,
    ContextConfigDefault,
    SchemaCompiler,
    TypeBoxTypeProvider
  >;

  export const onSendHandler = (handler: onSendHookHandler) => {
    return <const SchemaCompiler extends FastifySchema>(): OnSendHander<SchemaCompiler> => handler;
  };
}
