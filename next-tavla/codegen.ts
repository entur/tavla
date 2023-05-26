import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    overwrite: true,
    schema: './graphql-tools/schema.json',
    documents: 'src/**/*.graphql',
    hooks: { afterAllFileWrite: ['prettier --write'] },
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
    },
    generates: {
        'src/types/graphql-schema.ts': {
            plugins: ['typescript'],
        },
        'src/graphql/index.ts': {
            preset: 'import-types',
            presetConfig: {
                typesPath: 'types/graphql-schema',
            },
            plugins: ['typescript-operations', 'typed-document-node'],
            config: { withHooks: true },
        },
    },
}

export default config
