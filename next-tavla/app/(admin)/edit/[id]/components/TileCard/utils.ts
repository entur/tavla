import { TLineFragment } from 'Admin/scenarios/Edit/components/SelectLines/types'
import { GRAPHQL_ENDPOINTS } from 'assets/env'
import { QuayEditQuery, StopPlaceEditQuery } from 'graphql/index'
import { TQuay, TTransportMode } from 'types/graphql-schema'
import { TTile } from 'types/tile'
import { fieldsNotNull } from 'utils/typeguards'

export async function fetchLines(tile: TTile) {
    const res = await fetch(GRAPHQL_ENDPOINTS['journey-planner'], {
        headers: {
            'Content-Type': 'application/json',
            'ET-Client-Name': 'tavla-test',
        },
        body: JSON.stringify({
            query: tile.type === 'quay' ? QuayEditQuery : StopPlaceEditQuery,
            variables: { placeId: tile.placeId },
        }),
        method: 'POST',
    })
    const data = await res.json()
    if (tile.type === 'quay')
        return data.data?.quay?.lines.filter(fieldsNotNull) ?? []
    return (
        data.data?.stopPlace?.quays
            ?.flatMap((q: TQuay) => q?.lines)
            .filter(fieldsNotNull) || []
    )
}

export function sortLineByPublicCode(a: TLineFragment, b: TLineFragment) {
    if (!a || !a.publicCode || !b || !b.publicCode) return 1

    const containsLetters = /[a-åA-Å]/
    const aContainsLetters = containsLetters.test(a.publicCode)
    const bContainsLetters = containsLetters.test(b.publicCode)

    if (aContainsLetters && !bContainsLetters) return 1
    else if (!aContainsLetters && bContainsLetters) return -1

    return a.publicCode.localeCompare(b.publicCode, 'no-NB', {
        numeric: true,
    })
}

export function transportModeNames(transportMode: TTransportMode | null) {
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
            return 'Langdistanse buss'
        case 'unknown':
            return 'Ukjent'
        default:
            return null
    }
}
