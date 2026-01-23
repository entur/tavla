import { TTransportMode } from 'src/types/graphql-schema'
import { TLineFragment } from './types'

export function sortLineByPublicCode(a: TLineFragment, b: TLineFragment) {
    if (!a || !a.publicCode || !b || !b.publicCode) return 1

    const containsLetters = /[a-zæøåA-ZÆØÅ]/
    const aContainsLetters = containsLetters.test(a.publicCode)
    const bContainsLetters = containsLetters.test(b.publicCode)

    if (aContainsLetters && !bContainsLetters) return 1
    else if (!aContainsLetters && bContainsLetters) return -1

    return a.publicCode.localeCompare(b.publicCode, 'no-NB', {
        numeric: true,
    })
}

export function sortPublicCodes(a: string, b: string) {
    if (!a || !b) return 1

    const containsLetters = /[a-zæøåA-ZÆØÅ]/
    const aContainsLetters = containsLetters.test(a)
    const bContainsLetters = containsLetters.test(b)

    if (aContainsLetters && !bContainsLetters) return 1
    else if (!aContainsLetters && bContainsLetters) return -1

    return a.localeCompare(b, 'no-NB', {
        numeric: true,
    })
}

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
