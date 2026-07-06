import { describe, expect, it } from 'vitest'
import {
    normalizeCategory,
    normalizeLayer,
    type TGeoProperties,
} from './geocoder'

// Regression coverage for the geocoder v1 -> v3 migration. The search field
// requests layers=stopPlace,groupOfStopPlaces,address,street,poi; these two
// pure helpers decide how each layer renders. When only stopPlace,address was
// requested, streets/POIs/groups silently vanished from the field, so the
// contract below is exactly what must hold for them to keep showing up.

const props = (p: Partial<TGeoProperties>): TGeoProperties => p

describe('normalizeLayer', () => {
    it("maps v3 'stopPlace' back to v1's 'venue' vocabulary", () => {
        expect(normalizeLayer('stopPlace')).toBe('venue')
    })

    it.each([
        'address',
        'street',
        'poi',
        'groupOfStopPlaces',
        'place',
    ] as const)('passes the %s layer through unchanged', (layer) => {
        expect(normalizeLayer(layer)).toBe(layer)
    })

    it('returns undefined for a missing layer', () => {
        expect(normalizeLayer(undefined)).toBeUndefined()
    })
})

describe('normalizeCategory', () => {
    it('keeps a stop place NeTEx types from stopPlaceTypes', () => {
        expect(
            normalizeCategory(
                props({
                    layer: 'stopPlace',
                    stopPlaceTypes: ['onstreetBus', 'railStation'],
                }),
            ),
        ).toEqual(['onstreetBus', 'railStation'])
    })

    it('takes stopPlaceTypes precedence over the layer fallback', () => {
        // stopPlaceTypes is checked before the layer, so a populated list wins
        // regardless of which layer carried it.
        expect(
            normalizeCategory(
                props({ layer: 'poi', stopPlaceTypes: ['metroStation'] }),
            ),
        ).toEqual(['metroStation'])
    })

    it.each([
        'address',
        'street',
    ] as const)("marks the %s layer as 'vegadresse'", (layer) => {
        expect(normalizeCategory(props({ layer }))).toEqual(['vegadresse'])
    })

    it('returns undefined for a stop place without NeTEx types', () => {
        expect(normalizeCategory(props({ layer: 'stopPlace' }))).toBeUndefined()
        expect(
            normalizeCategory(
                props({ layer: 'stopPlace', stopPlaceTypes: [] }),
            ),
        ).toBeUndefined()
    })

    it.each([
        'poi',
        'place',
        'groupOfStopPlaces',
    ] as const)("renders the %s layer with the generic 'poi' pin", (layer) => {
        expect(normalizeCategory(props({ layer }))).toEqual(['poi'])
    })

    it("falls back to 'poi' when the layer is missing", () => {
        expect(normalizeCategory(props({}))).toEqual(['poi'])
    })
})
