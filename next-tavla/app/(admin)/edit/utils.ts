import { NormalizedDropdownItemType } from '@entur/dropdown'
import { HomeIcon, MapPinIcon } from '@entur/icons'
import { getTransportIcon } from 'components/TransportIcon'
import { uniq } from 'lodash'
import { TTransportMode } from 'types/graphql-schema'
import { TLocation } from 'types/meta'
import { TOrganization } from 'types/settings'

export type TCategory =
    | 'onstreetBus'
    | 'onstreetTram'
    | 'airport'
    | 'railStation'
    | 'metroStation'
    | 'busStation'
    | 'coachStation'
    | 'tramStation'
    | 'harbourPort'
    | 'ferryPort'
    | 'ferryStop'
    | 'liftStation'
    | 'vehicleRailInterchange'
    | 'poi'
    | 'vegadresse'

export function locationToDropdownItem(
    location: TLocation,
): NormalizedDropdownItemType<TLocation> {
    return {
        label: location.name ?? '',
        value: location,
    }
}

export function organizationToDropdownItem(
    organization: TOrganization,
): NormalizedDropdownItemType<TOrganization> {
    return {
        label: organization.name ?? '',
        value: organization ?? undefined,
    }
}

export function categoryToTransportmode(category: TCategory): TTransportMode {
    switch (category) {
        case 'onstreetBus':
        case 'busStation':
        case 'coachStation':
            return 'bus'
        case 'tramStation':
        case 'onstreetTram':
            return 'tram'
        case 'railStation':
            return 'rail'
        case 'harbourPort':
        case 'ferryPort':
        case 'ferryStop':
            return 'water'
        case 'liftStation':
            return 'lift'
        case 'metroStation':
            return 'metro'
        case 'airport':
            return 'air'
        case 'vehicleRailInterchange':
        default:
            return 'unknown'
    }
}

export function getVenueIcon(category: TCategory) {
    switch (category) {
        case 'vegadresse':
            return HomeIcon
        default:
            return MapPinIcon
    }
}

export function getIcons(layer?: string, category?: TCategory[]) {
    if (!layer || !category) return
    if (layer !== 'venue')
        return uniq(uniq(category).map((mode) => getVenueIcon(mode)))
    return uniq(category).map((mode) =>
        getTransportIcon(categoryToTransportmode(mode)),
    )
}

export function isEmptyOrSpaces(str?: string) {
    return str === undefined || str.match(/^ *$/) !== null
}
