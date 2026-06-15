import type { TTransportMode } from 'src/types/graphql-schema'
import type { TileColumnDB } from 'types/db-types/boards'

export function transportModeNames(
    transportMode: TTransportMode | null | undefined,
) {
    switch (transportMode) {
        case 'air':
            return 'Fly'
        case 'bus':
            return 'Buss'
        case 'cableway':
            return 'Kabelbane'
        case 'water':
            return 'Båt'
        case 'funicular':
            return 'Taubane'
        case 'lift':
            return 'Heis'
        case 'rail':
            return 'Tog'
        case 'metro':
            return 'T-bane'
        case 'tram':
            return 'Trikk'
        case 'trolleybus':
            return 'Trolley-buss'
        case 'monorail':
            return 'Enskinnebane'
        case 'coach':
            return 'Langdistansebuss'
        case 'taxi':
            return 'Taxi'
        case 'unknown':
            return 'Ukjent'
        default:
            return null
    }
}

export type TileFormValues = {
    columns: TileColumnDB[]
    count: number | null
    offset: number | null
    displayName: string
    quayLineKeys: string[]
}

export function parseTileFormData(data: FormData): TileFormValues {
    const columns = data.getAll('columns') as TileColumnDB[]
    data.delete('columns')
    const count = data.get('count') as number | null
    data.delete('count')
    const offset = data.get('offset') as number | null
    data.delete('offset')
    const displayName = data.get('displayName') as string
    data.delete('displayName')

    const quayLineKeys: string[] = []
    for (const value of data.values()) {
        quayLineKeys.push(value as string)
    }

    return { columns, count, offset, displayName, quayLineKeys }
}
