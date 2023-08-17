export default {
  projects: {
    default: {
      schema: 'graphql/schema.graphql',
      extensions: {
        /** @type {import('@graphql-codegen/cli').CodegenConfig} */
        codegen: {
          overwrite: true,
          generates: {
            'types/__generated__/graphql.d.ts': {
              plugins: ['typescript', 'typescript-resolvers'],
              config: {
                enumsAsTypes: true,
                contextType: '../../src/config/context.js#GraphQLContext',
              },
            },
          },
        },
      },
    },
  },
};
