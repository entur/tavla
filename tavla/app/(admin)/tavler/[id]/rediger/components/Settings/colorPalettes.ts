import { useMemo } from 'react'
import { BoardDB, TransportPalette } from 'types/db-types/boards'

const baseTransportPalettes = [
    { label: 'Nasjonal', value: 'default' },
    { label: 'Blå buss', value: 'blue-bus' },
    { label: 'Grønn buss', value: 'green-bus' },
    { label: 'Lokal', value: 'atb' },
    { label: 'Lokal', value: 'fram' },
]

export const COUNTY_THEME_MAP = {
    Trøndelag: 'atb' as const,
    'Møre og Romsdal': 'fram' as const,
} as const

export type CountyThemeKey = keyof typeof COUNTY_THEME_MAP
export type CountyThemeValue = (typeof COUNTY_THEME_MAP)[CountyThemeKey]

export const useAllowedPalettes = (board: BoardDB) =>
    useMemo(() => {
        const counties = new Set<string>()

        board.tiles.forEach((tile) => {
            if (tile.county) {
                counties.add(tile.county)
            }
        })

        const hasCountyThemes = Array.from(counties).some(
            (county) =>
                COUNTY_THEME_MAP[county as keyof typeof COUNTY_THEME_MAP],
        )

        const themes = new Set<TransportPalette>(['default'])

        if (hasCountyThemes) {
            counties.forEach((county) => {
                const theme =
                    COUNTY_THEME_MAP[county as keyof typeof COUNTY_THEME_MAP]
                if (theme) {
                    themes.add(theme as TransportPalette)
                }
            })
        } else {
            themes.add('blue-bus')
            themes.add('green-bus')
        }

        return Array.from(themes)
    }, [board.tiles])

export const generateTransportPalettes = (
    allowedPalettes: TransportPalette[],
) => {
    const filteredPalettes = allowedPalettes
        ? baseTransportPalettes.filter(
              (palette) =>
                  palette.value === 'default' ||
                  allowedPalettes.includes(palette.value as TransportPalette),
          )
        : baseTransportPalettes

    const localPalettes = filteredPalettes.filter(
        (palette) => palette.value === 'atb' || palette.value === 'fram',
    )

    if (localPalettes.length > 1) {
        let localCounter = 1
        return filteredPalettes.map((palette) => {
            if (palette.value === 'atb' || palette.value === 'fram') {
                return {
                    ...palette,
                    label: `Lokal ${localCounter++}`,
                }
            }
            return palette
        })
    }

    return filteredPalettes
}
