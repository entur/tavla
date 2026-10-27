import type { TTransportMode } from 'src/types/graphql-schema'
import type { BoardTileDB } from 'types/db-types/boards'
import type { QuayWithFrontText } from '../utils/types'

export function transportModeNames(
    transportMode: TTransportMode | null | undefined,
) {
    switch (transportMode) {
        case 'air':
            return 'Fly'
        case 'bus':
            return 'Buss'
        case 'cableway':
            return 'Kabelbane'
        case 'water':
            return 'Båt'
        case 'funicular':
            return 'Taubane'
        case 'lift':
            return 'Heis'
        case 'rail':
            return 'Tog'
        case 'metro':
            return 'T-bane'
        case 'tram':
            return 'Trikk'
        case 'trolleybus':
            return 'Trolley-buss'
        case 'monorail':
            return 'Enskinnebane'
        case 'coach':
            return 'Langdistansebuss'
        case 'taxi':
            return 'Taxi'
        case 'unknown':
            return 'Ukjent'
        default:
            return null
    }
}

export function generateQuayLineKey(quayId: string, lineId: string): string {
    return `${quayId}||${lineId}`
}

/**
 * Fjerner deprekerte linje-/retningsvalg-felter (linesWithDirection,
 * whitelistedLines) fra en tile. quays er nå eneste kilde for hvilke linjer
 * som er valgt — uten dette vil tavla-visning falle tilbake til et gammelt
 * whitelistedLines-filter når quays er tom (f.eks. "alle linjer valgt").
 */
export function stripLegacyLineSelectionFields(tile: BoardTileDB): BoardTileDB {
    const { linesWithDirection, whitelistedLines, ...rest } = tile
    return rest
}

export function countSelectableQuayLineKeys(
    quays: QuayWithFrontText[],
): number {
    return quays.reduce((sum, quay) => sum + quay.lines.length, 0)
}

/**
 * Computes which quay-line keys are pre-checked when a saved tile is opened.
 * `tile.quays`/`tile.whitelistedLines` decide which lines are selected.
 */
export function getInitialCheckedLineIds(
    tile: BoardTileDB,
    quays: QuayWithFrontText[],
): Set<string> {
    const set = new Set<string>()
    const hasQuayFilter = tile.quays && tile.quays.length > 0

    for (const quay of quays) {
        const savedQuay = tile.quays?.find((q) => q.id === quay.id)
        if (savedQuay) {
            if (savedQuay.whitelistedLines.length === 0) {
                for (const l of quay.lines) {
                    set.add(generateQuayLineKey(quay.id, l.id))
                }
            } else {
                for (const lineId of savedQuay.whitelistedLines) {
                    const line = quay.lines.find((l) => l.id === lineId)
                    if (!line) continue
                    set.add(generateQuayLineKey(quay.id, line.id))
                }
            }
        } else if (hasQuayFilter) {
            // Per-quay filter exists but this quay has no entry: nothing selected
        } else if (tile.whitelistedLines && tile.whitelistedLines.length > 0) {
            for (const l of quay.lines) {
                if (tile.whitelistedLines?.includes(l.id)) {
                    set.add(generateQuayLineKey(quay.id, l.id))
                }
            }
        } else {
            for (const l of quay.lines) {
                set.add(generateQuayLineKey(quay.id, l.id))
            }
        }
    }

    return set
}
