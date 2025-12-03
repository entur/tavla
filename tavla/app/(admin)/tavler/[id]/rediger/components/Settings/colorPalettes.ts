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
        return filteredPalettes.map((palette) => {
            if (palette.value === 'atb') {
                return {
                    ...palette,
                    label: 'Lokal (Trøndelag)',
                }
            } else if (palette.value === 'fram') {
                return {
                    ...palette,
                    label: 'Lokal (Møre og Romsdal)',
                }
            }
            return palette
        })
    }

    return filteredPalettes
}

export const PALETTE_COLOR_DESCRIPTIONS: Record<
    string,
    Record<string, string>
> = {
    default: {
        bus: 'rød',
        rail: 'blå',
        tram: 'blå',
        metro: 'oransje',
        water: 'blå',
        air: 'oransje',
        taxi: 'gul',
        coach: 'grønn',
        cableway: 'grå',
        funicular: 'grå',
    },
    'blue-bus': {
        bus: 'blå',
        rail: 'rød',
    },
    'green-bus': {
        bus: 'grønn',
    },
    atb: {
        bus: 'grønn',
        tram: 'grønn',
        rail: 'lilla',
        metro: 'lilla',
        water: 'mørk blå',
        air: 'grå',
        taxi: 'lilla',
        coach: 'blå',
    },
    fram: {
        bus: 'mørk blå',
        coach: 'grønn',
        rail: 'mørk rød',
        water: 'blå',
        air: 'grå',
        metro: 'grå',
        tram: 'grå',
        taxi: 'rosa',
    },
    svipper: {
        bus: 'blå',
        coach: 'grønn',
        rail: 'rosa',
        water: 'turkis',
        air: 'mørk grå',
    },
}

export const getTransportColorDescription = (
    palette: string,
    mode: string,
): string => {
    const paletteColors = PALETTE_COLOR_DESCRIPTIONS[palette]
    const defaultColors = PALETTE_COLOR_DESCRIPTIONS['default']

    if (paletteColors && paletteColors[mode]) {
        return paletteColors[mode]
    }

    if (defaultColors && defaultColors[mode]) {
        return defaultColors[mode]
    }

    return ''
}
