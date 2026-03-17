import { TQuay, TTransportMode } from 'src/types/graphql-schema'

export type TLineFragment = {
    __typename?: 'Line'
    id: string
    publicCode: string | null
    name: string | null
    transportMode: TTransportMode | null
    quayName?: string | null
    quayPublicCode?: string | null
    frontTexts?: string[]
}

export type TQuayFrontText = Omit<TQuay, 'lines'> & { lines: TLineFragment[] }
