import type { CodegenConfig } from '@graphql-codegen/cli'

const generatorConfig = {
    avoidOptionals: {
        field: true,
        inputTypes: false,
        object: false,
        defaultValue: false,
    },
    withHooks: true,
    documentMode: 'documentNode',
    dedupeOperationSuffix: true,
}

const config: CodegenConfig = {
    overwrite: true,
    generates: {
        './graphql-schemas/journey-planner-v3.json': {
            schema: 'https://api.entur.io/journey-planner/v3/graphql',
            plugins: ['introspection'],
        },
        './graphql-generated/journey-planner-v3.ts': {
            schema: 'https://api.entur.io/journey-planner/v3/graphql',
            documents: ['./src/**/*.journey-planner.graphql'],
            plugins: [
                'typescript',
                'typescript-operations',
                'typescript-react-apollo',
            ],
            config: {
                ...generatorConfig,
                scalars: {
                    Coordinates: '../src/types/JourneyPlannerV3#Coordinates',
                    Date: '../src/types/JourneyPlannerV3#Date',
                    DateTime: '../src/types/JourneyPlannerV3#DateTime',
                    LocalTime: '../src/types/JourneyPlannerV3#LocalTime',
                    Time: '../src/types/JourneyPlannerV3#Time',
                    Long: '../src/types/JourneyPlannerV3#Long',
                    DoubleFunction:
                        '../src/types/JourneyPlannerV3#DoubleFunction',
                },
            },
        },
        './graphql-schemas/vehicles-v1.json': {
            schema: 'https://api.entur.io/realtime/v1/vehicles/graphql',
            plugins: ['introspection'],
        },
        './graphql-generated/vehicles-v1.ts': {
            schema: 'https://api.entur.io/realtime/v1/vehicles/graphql',
            documents: ['./src/**/*.vehicles.graphql'],
            plugins: [
                'typescript',
                'typescript-operations',
                'typescript-react-apollo',
            ],
            config: {
                ...generatorConfig,
                scalars: {
                    DateTime: '../src/types/VehiclesV1#DateTime',
                },
            },
        },
        './graphql-schemas/mobility-v2.json': {
            schema: 'https://api.entur.io/mobility/v2/graphql',
            plugins: ['introspection'],
        },
        './graphql-generated/mobility-v2.ts': {
            schema: 'https://api.entur.io/mobility/v2/graphql',
            documents: ['./src/**/*.mobility.graphql'],
            plugins: [
                'typescript',
                'typescript-operations',
                'typescript-react-apollo',
            ],
            config: generatorConfig,
        },
    },
}

// eslint-disable-next-line import/no-default-export
export default config
