import type { NormalizedDropdownItemType } from '@entur/dropdown'
import { HomeIcon, MapPinIcon } from '@entur/icons'
import TransportIcon from 'app/_components/TransportIcon/TransportIcon'
import type {
    TGeoProperties,
    TStopPlaceType,
} from 'app/(innlogget)/utils/geocoder'
import { uniq } from 'lodash'
import { createElement } from 'react'
import type { BoardTheme, LocationDB } from 'src/types/db-types/boards'
import type { FolderDB } from 'src/types/db-types/folders'
import type {
    TTransportMode,
    TTransportSubmode,
} from 'src/types/graphql-schema'

export function locationToDropdownItem(
    location: LocationDB,
): NormalizedDropdownItemType<LocationDB> {
    return {
        label: location.name ?? '',
        value: location,
    }
}

export function folderToDropdownItem(
    folder: FolderDB,
): NormalizedDropdownItemType<FolderDB> {
    return {
        label: folder.name ?? '',
        value: folder ?? null,
    }
}

export const themes: NormalizedDropdownItemType<BoardTheme>[] = [
    { label: 'Mørk', value: 'dark' },
    { label: 'Lys', value: 'light' },
]

export function themeToDropdownItem(
    theme: BoardTheme,
): NormalizedDropdownItemType<BoardTheme> {
    return (
        themes.find((item) => item.value === theme) ?? {
            label: 'Mørk',
            value: 'dark',
        }
    )
}

export function stopPlaceTypeToTransportMode(
    stopPlaceType: TStopPlaceType,
): TTransportMode {
    switch (stopPlaceType) {
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
        default:
            return 'unknown'
    }
}

const getTravelTagsFromTransportMode = (transportModes: TTransportMode[]) => {
    return transportModes.map((tm, index) => {
        const UniqueSmallTravelTag = () =>
            createElement(TransportIcon, {
                transportMode: tm,
                background: true,
                whiteIcon: true,
                size: 6,
                className: 'm-0.5',
            })

        UniqueSmallTravelTag.displayName = `TravelTag-${tm}-${index}`
        return UniqueSmallTravelTag
    })
}

export function getIcons(properties: TGeoProperties) {
    switch (properties.layer) {
        case 'address':
        case 'street':
            return [HomeIcon]
        case 'poi':
            return [MapPinIcon]
        case 'stopPlace': {
            const transportModes = properties.stopPlaceTypes
                ?.filter((type) => type === 'other')
                .map(stopPlaceTypeToTransportMode)
            const uniqueTransportModes = uniq(transportModes)

            if (!uniqueTransportModes || uniqueTransportModes.length === 0) {
                return [MapPinIcon]
            }

            return getTravelTagsFromTransportMode(uniqueTransportModes)
        }
        case 'groupOfStopPlaces':
            return [MapPinIcon]
        default:
            return [MapPinIcon]
    }
}

export const travelTagsFromModes = (
    modes: Array<{
        transportMode: TTransportMode
        transportSubmode?: TTransportSubmode
    }>,
) => {
    return modes.map((mode, index) => {
        const UniqueSmallTravelTag = () =>
            createElement(TransportIcon, {
                transportMode: mode.transportMode,
                transportSubmode: mode.transportSubmode,
                background: true,
                whiteIcon: true,
                size: 6,
                className: 'm-0.5',
            })
        UniqueSmallTravelTag.displayName = `TravelTag-${mode.transportMode}-${mode.transportSubmode ?? ''}-${index}`
        return UniqueSmallTravelTag
    })
}

export function isEmptyOrSpaces(str?: string) {
    return str === undefined || str?.match(/^ *$/) !== null
}
export function isOnlyWhiteSpace(str: string) {
    if (str === undefined || str === null || str === '') return false

    return str.trim() === ''
}
