import type { TCategory } from '../tavler/[id]/utils'

/**
 * Pure normalisation of Entur geocoder v3 results back to the flat vocabulary
 * the rest of the app consumes. Kept dependency-free (only a type-only import)
 * so it can be unit-tested without pulling in fetch, env or React.
 *
 * v3 returns a GeoJSON FeatureCollection with structured `properties` (see the
 * v2→v3 migration guide). v1's broad `venue,address` search maps onto these
 * layers; `fetchStopPlaces` requests them all so the search field keeps showing
 * stop places, groups, addresses, streets and POIs like it did on v1.
 */
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
    stopPlaceTypes?: TCategory[]
}

// v3 renamed the stop-place layer from v1's 'venue' to 'stopPlace'. The rest of
// the app (getIcons, getTypeOfPlace) still speaks the 'venue' vocabulary.
export function normalizeLayer(layer?: TGeoLayer): string | undefined {
    return layer === 'stopPlace' ? 'venue' : layer
}

// v3 split v1's flat `category` into `stopPlaceTypes` (NeTEx types for stops)
// and `categories` (OSM tags). Stops keep their NeTEx types; addresses keep the
// 'vegadresse' marker v1 used to pick the address icon and place type.
export function normalizeCategory(
    properties: TGeoProperties,
): TCategory[] | undefined {
    if (properties.stopPlaceTypes && properties.stopPlaceTypes.length > 0)
        return properties.stopPlaceTypes
    if (properties.layer === 'address' || properties.layer === 'street')
        return ['vegadresse']
    if (properties.layer === 'stopPlace') return undefined
    // poi / place / groupOfStopPlaces — non-stop, non-address results render
    // the generic location pin (v1 returned a 'poi'-style category here).
    return ['poi']
}
