import { Transport } from '@entur/travel/dist/utils'
import { xor } from 'lodash'
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

export function isTransportModeInWhitelist(
    transportMode: TTransportMode,
    whitelist?: TTransportMode[],
) {
    if (!whitelist) return true
    return whitelist.includes(transportMode)
}

export function getMinimalTransportModesArray(
    toggledTransportMode: TTransportMode,
    activeTransportModes: TTransportMode[],
    allTransportModes: TTransportMode[],
) {
    // All transport modes are currently active, keep all but toggled enabled
    if (activeTransportModes.length === 0)
        return xor([toggledTransportMode], allTransportModes)

    // If this toggle would result in all transport modes being active
    // we do not need to store any due to nature of whitelist
    if (
        xor([toggledTransportMode], activeTransportModes).length ===
        allTransportModes.length
    )
        return []

    // No more edge cases, toggle against the active transport modes
    return xor([toggledTransportMode], activeTransportModes)
}
