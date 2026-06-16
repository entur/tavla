import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    overwrite: true,
    schema: './graphql-tools/schema.json',
    documents: 'src/**/*.graphql',
    hooks: {
        afterAllFileWrite: ['biome format --write'],
    },
    config: {
        typesPrefix: 'T',
        documentMode: 'string',
        documentVariableSuffix: 'Query',
        fragmentVariableSuffix: 'Fragment',
        skipTypeName: true,
        enumsAsTypes: true,
        useTypeImports: true,
        scalars: {
            Coordinates: 'Coordinates',
            Date: 'Date',
            DateTime: 'DateTime',
            Duration: 'Duration',
            LocalTime: 'LocalTime',
            Time: 'Time',
            Long: 'Long',
            DoubleFunction: 'DoubleFunction',
        },
        avoidOptionals: {
            field: true,
        },
    },
    generates: {
        // Base schema types (objects, enums, inputs, scalars).
        'src/types/graphql-schema.ts': {
            plugins: ['typescript'],
        },
        // Operation/fragment result + variable types. Imports base types from graphql-schema
        'src/types/operations.ts': {
            preset: 'import-types',
            presetConfig: {
                typesPath: 'types/graphql-schema',
            },
            plugins: ['typescript-operations'],
        },
        // Typed document strings. Reference the operation types above.
        'src/graphql/index.ts': {
            preset: 'import-types',
            presetConfig: {
                typesPath: 'types/operations',
            },
            plugins: ['typed-document-node'],
            config: { withHooks: true },
        },
    },
}

export default config
