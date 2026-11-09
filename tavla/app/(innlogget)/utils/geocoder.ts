export type TGeoLayer =
    | 'address'
    | 'street'
    | 'stopPlace'
    | 'groupOfStopPlaces'
    | 'poi'
    | 'place'

export type TGeoProperties = {
    id?: string
    names?: {
        default?: string
        display?: string
    }
    layer?: TGeoLayer
    address?: {
        county?: string
    }
    stopPlaceTypes?: TStopPlaceType[]
}

export type TStopPlaceType =
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
    | 'other'

export function isStopPlace(layer?: TGeoLayer): boolean {
    return layer === 'stopPlace'
}

export type TypeOfPlace =
    | 'stop_place'
    | 'address'
    | 'other'
    | 'current_position'

export function getTypeOfPlace(properties: TGeoProperties): TypeOfPlace {
    switch (properties.layer) {
        case 'stopPlace':
            return 'stop_place'
        case 'address':
        case 'street':
            return 'address'
        case 'poi':
            return 'other'
        default:
            return 'other'
    }
}
