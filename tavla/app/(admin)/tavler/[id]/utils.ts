import { NormalizedDropdownItemType } from '@entur/dropdown'
import { HomeIcon, MapPinIcon } from '@entur/icons'
import { SmallTravelTag } from 'components/TravelTag'
import { uniq } from 'lodash'
import { TTransportMode } from 'types/graphql-schema'
import { TLocation } from 'types/meta'
import { TFolder, TTheme } from 'types/settings'

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

export function folderToDropdownItem(
    folder: TFolder,
): NormalizedDropdownItemType<TFolder> {
    return {
        label: folder.name ?? '',
        value: folder ?? undefined,
    }
}

export const themes: NormalizedDropdownItemType<TTheme>[] = [
    { label: 'Mørk', value: 'dark' },
    { label: 'Lys', value: 'light' },
]

export function themeToDropdownItem(
    theme: TTheme,
): NormalizedDropdownItemType<TTheme> {
    return (
        themes.find((item) => item.value === theme) ?? {
            label: 'Mørk',
            value: 'dark',
        }
    )
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

const travelTags = (category: TCategory[]) => {
    const transportModes = uniq(
        category.map((mode) => categoryToTransportmode(mode)),
    )

    return transportModes.map((tm, index) => {
        // unique key for each travel tag
        const UniqueSmallTravelTag = () =>
            SmallTravelTag({
                transportMode: tm,
            })
        UniqueSmallTravelTag.displayName = `TravelTag-${tm}-${index}`
        return UniqueSmallTravelTag
    })
}

export function getIcons(layer?: string, category?: TCategory[]) {
    if (!layer || !category) return
    if (layer !== 'venue')
        return uniq(uniq(category).map((mode) => getVenueIcon(mode)))
    return travelTags(category)
}

export function isEmptyOrSpaces(str?: string) {
    return str === undefined || str.match(/^ *$/) !== null
}
export function isOnlyWhiteSpace(str: string) {
    if (str === undefined || str === null || str === '') return false

    return str.trim() === ''
}
