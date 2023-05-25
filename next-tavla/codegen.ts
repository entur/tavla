import type { CodegenConfig } from '@graphql-codegen/cli'

const sharedConfig = {
    typesPrefix: 'T',
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
    enumsAsTypes: true,
}

const config: CodegenConfig = {
    overwrite: true,
    schema: './graphql-tools/schema.json',
    documents: ['src/**/*.ts', 'src/**/*.tsx'],
    generates: {
        './src/types/graphql/index.ts': {
            plugins: ['typescript-operations'],
            preset: 'import-types',
            presetConfig: {
                typesPath: './schema',
            },
            config: {
                skipTypeName: true,
                omitOperationSuffix: true,
                ...sharedConfig,
            },
        },
        './src/types/graphql/schema.ts': {
            plugins: ['typescript'],
            config: {
                ...sharedConfig,
            },
        },
    },
}

export default config
