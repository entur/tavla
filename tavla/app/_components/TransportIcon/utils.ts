import type { LineWithFrontText } from 'app/_components/TileCard/types'
import { transportModeNames } from 'app/_components/TileCard/utils'
import { uniqBy } from 'lodash'
import type { TTransportMode, TTransportSubmode } from 'types/graphql-schema'
import { getRelevantSubmode } from 'utils/transport'
import {
    BusIcon,
    CablewayIcon,
    CarferryIcon,
    FerryIcon,
    FunicularIcon,
    MetroIcon,
    PlaneIcon,
    RailIcon,
    TaxiIcon,
    TramIcon,
    UnknownIcon,
} from './icons'

export const sizeClasses: Record<4 | 6 | 7, string> = {
    4: 'h-4 w-4',
    6: 'h-6 w-6',
    7: 'h-7 w-7',
}

export function getTransportIcon(
    transportMode: TTransportMode,
    transportSubmode?: TTransportSubmode,
) {
    if (transportSubmode?.includes('CarFerry')) return CarferryIcon

    switch (transportMode) {
        case 'air':
            return PlaneIcon
        case 'coach':
        case 'trolleybus':
        case 'bus':
            return BusIcon
        case 'funicular':
            return FunicularIcon
        case 'lift':
        case 'cableway':
            return CablewayIcon
        case 'metro':
            return MetroIcon
        case 'monorail':
        case 'rail':
            return RailIcon
        case 'tram':
            return TramIcon
        case 'taxi':
            return TaxiIcon
        case 'water':
            return FerryIcon
        default:
            return UnknownIcon
    }
}

export function getColorMode(
    transportMode: TTransportMode,
    transportSubmode?: TTransportSubmode,
): string {
    if (transportSubmode?.startsWith('airport')) return 'air'
    if (transportSubmode === 'railReplacementBus') return 'rail'
    if (transportSubmode === 'regionalBus') return 'regional-bus'
    return transportMode
}

export function sortByTransportMode<
    T extends {
        transportMode: string | null
        transportSubmode?: string | null
    },
>(a: T, b: T): number {
    const modeA = a.transportMode ?? ''
    const modeB = b.transportMode ?? ''
    if (modeA !== modeB) {
        return modeA < modeB ? -1 : 1
    }
    const submodeA = a.transportSubmode ?? ''
    const submodeB = b.transportSubmode ?? ''
    return submodeA < submodeB ? -1 : submodeA > submodeB ? 1 : 0
}

export const getTransportModesFromLines = (lines: LineWithFrontText[]) =>
    uniqBy(
        lines
            .filter((line) => line.transportMode)
            .map((line) => ({
                transportMode: line.transportMode,
                transportSubmode: getRelevantSubmode(
                    line.transportSubmode ?? undefined,
                ),
            })),
        (m) => `${m.transportMode}|${m.transportSubmode ?? ''}`,
    )

export const getTransportModeString = ({
    subMode,
    mainMode,
}: {
    subMode: string
    mainMode: string
}): string => {
    switch (subMode) {
        case 'airportLinkBus':
            return 'Flybuss'
        case 'airportLinkRail':
            return 'Flytog'
        case 'railReplacementBus':
            return 'Buss for tog'
        case 'regionalBus':
            return 'Regionbuss'
        default:
            return transportModeNames(mainMode as TTransportMode) ?? ''
    }
}
