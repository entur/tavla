import type { TTransportMode } from 'src/types/graphql-schema'
import { z } from 'zod'

const transportModeValues: TTransportMode[] = [
    'air',
    'bus',
    'cableway',
    'coach',
    'funicular',
    'lift',
    'metro',
    'monorail',
    'rail',
    'taxi',
    'tram',
    'trolleybus',
    'unknown',
    'water',
] as const

const transportModeSchema = z.enum(transportModeValues)

const coordinateSchema = z.object({
    lat: z.number(),
    lng: z.number(),
})

const locationSchema = z.object({
    name: z.string().optional(),
    coordinate: coordinateSchema.optional(),
})

const boardWalkingDistanceSchema = z.object({
    distance: z.number().optional(),
    visible: z.boolean().optional(),
})

const tileColumnValues = [
    'aimedTime',
    'arrivalTime',
    'line',
    'destination',
    'name',
    'platform',
    'time',
] as const

const tileColumnSchema = z.enum(tileColumnValues)

const quaySchema = z.object({
    id: z.string(),
    whitelistedLines: z.array(z.string()),
})

const boardTileSchema = z.object({
    uuid: z.string(),
    name: z.string(),
    stopPlaceId: z.string(),
    quays: z.array(quaySchema),
    walkingDistance: boardWalkingDistanceSchema.optional(),
    offset: z.number().optional(),
    displayName: z.string().optional(),
    columns: z.array(tileColumnSchema).optional(),
    county: z.string().optional(),

    /** @deprecated Only kept for backward-compat with unmigrated DB docs */
    placeId: z.string().optional(),

    /** @deprecated Only kept for backward-compat with unmigrated DB docs */
    type: z.enum(['stop_place', 'quay']).optional(),

    /** @deprecated Only kept for backward-compat with unmigrated DB docs */
    whitelistedLines: z.array(z.string()).optional(),

    /** @deprecated Only kept for backward-compat with unmigrated DB docs */
    whitelistedTransportModes: z.array(transportModeSchema).optional(),
})

const boardFontSizeSchema = z.enum(['small', 'medium', 'large'])

const boardMetaSchema = z.object({
    title: z.string().optional(),
    created: z.number().optional(),
    dateModified: z.number().optional(),
    lastActiveTimestamp: z.number().optional(),
    fontSize: boardFontSizeSchema.optional(),
    location: locationSchema.optional(),
})

const combinedTilesSchema = z.object({
    ids: z.array(z.string()),
})

const boardThemeSchema = z.enum(['dark', 'light'])

const boardFooterSchema = z.object({
    footer: z.string().optional(),
})

const transportPaletteSchema = z.enum([
    'default',
    'blue-bus',
    'green-bus',
    'atb',
    'fram',
    'reis',
])

export const BoardDBSchema = z.object({
    id: z.string(),
    meta: boardMetaSchema,
    tiles: z.array(boardTileSchema),
    combinedTiles: z.array(combinedTilesSchema).optional(),
    isCombinedTiles: z.boolean().optional(),
    theme: boardThemeSchema.optional(),
    footer: boardFooterSchema.optional(),
    transportPalette: transportPaletteSchema.optional(),
    hideLogo: z.boolean().optional(),
    hideClock: z.boolean().optional(),
})

export type BoardDB = z.infer<typeof BoardDBSchema>

export type BoardFooter = z.infer<typeof boardFooterSchema>

export type CombinedTilesDB = z.infer<typeof combinedTilesSchema>

export type BoardTheme = z.infer<typeof boardThemeSchema>

export type TransportPalette = z.infer<typeof transportPaletteSchema>

export type BoardMetaDB = z.infer<typeof boardMetaSchema>

export type BoardFontSize = z.infer<typeof boardFontSizeSchema>

export type Coordinate = z.infer<typeof coordinateSchema>

export type LocationDB = z.infer<typeof locationSchema>

export type BaseTileDB = z.infer<typeof boardTileSchema>

export type TileColumnDB = z.infer<typeof tileColumnSchema>

export const TileColumns: Record<TileColumnDB, string> = {
    aimedTime: 'Planlagt',
    arrivalTime: 'Ankomst',
    line: 'Linje',
    destination: 'Destinasjon',
    name: 'Stoppested',
    platform: 'Plattform',
    time: 'Forventet',
} as const

export type BoardTileDB = z.infer<typeof boardTileSchema>

export type BoardWalkingDistanceDB = z.infer<typeof boardWalkingDistanceSchema>
