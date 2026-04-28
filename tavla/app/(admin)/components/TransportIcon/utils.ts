import type { TTransportMode, TTransportSubmode } from 'types/graphql-schema'
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
