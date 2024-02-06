import { TTransportMode } from 'types/graphql-schema'

export type TLineFragment = {
    __typename?: 'Line'
    id: string
    publicCode: string | null
    name: string | null
    transportMode: TTransportMode | null
}
