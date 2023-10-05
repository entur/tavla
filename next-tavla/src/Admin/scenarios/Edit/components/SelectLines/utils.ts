import { Transport } from '@entur/travel/dist/utils'
import { TLineFragment } from './types'
import { TTransportMode } from 'types/graphql-schema'

export const transportModeNames: Record<TTransportMode, string> = {
    air: 'Fly',
    bus: 'Buss',
    cableway: 'Kabelbane',
    water: 'Båt',
    funicular: 'Taubane',
    lift: 'Heis',
    rail: 'Tog',
    metro: 'T-bane',
    tram: 'Trikk',
    trolleybus: 'Trolley-buss',
    monorail: 'Enskinnebane',
    coach: 'Langdistanse buss',
    unknown: 'Ukjent',
}

export function getTransportMode(transportMode: TTransportMode): Transport {
    switch (transportMode) {
        case 'coach':
        case 'trolleybus':
            return 'bus'
        case 'lift':
        case 'unknown':
            return 'none'
        case 'monorail':
            return 'rail'
        default:
            return transportMode
    }
}

export function isWhitelistInactive(whitelist?: string[]) {
    return !whitelist || whitelist.length === 0
}

export function isEntityInWhitelist(entity: string, whitelist?: string[]) {
    if (!whitelist) return true
    return whitelist.includes(entity)
}

export function isEveryEntityInArray<T>(entity?: T[], array?: T[]) {
    if (!entity || !array) return false
    return entity.every((e) => array.includes(e))
}

export function isSomeEntityInArray<T>(entity?: T[], array?: T[]) {
    if (!entity || !array) return false
    return entity.some((e) => array.includes(e))
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
