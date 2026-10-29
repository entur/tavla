import type { TTransportMode } from 'src/types/graphql-schema'
import type { BoardTileDB, QuaysFilterDB } from 'types/db-types/boards'
import type { LineWithFrontText, QuayWithFrontText } from '../utils/types'

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

export function sortLineFragment(
    a: LineWithFrontText,
    b: LineWithFrontText,
): number {
    const modeA = a.transportMode || ''
    const modeB = b.transportMode || ''

    if (modeA !== modeB) {
        return modeA.localeCompare(modeB)
    }

    const codeA = a.publicCode || ''
    const codeB = b.publicCode || ''

    return codeA.localeCompare(codeB, undefined, {
        numeric: true,
    })
}

export function expandQuaysFilter(
    filter: QuaysFilterDB,
    quays: QuayWithFrontText[],
): QuaysFilterDB {
    return {
        type: 'quaysFilter',
        quays: quays.map((quay) => {
            const allLineIds = quay.lines.map((line) => line.id)
            const quayFilter = filter.quays.find((q) => q.id === quay.id)

            if (quayFilter) {
                return {
                    id: quay.id,
                    whitelistedLines:
                        quayFilter.whitelistedLines.length === 0
                            ? allLineIds
                            : quayFilter.whitelistedLines,
                }
            }

            const quayHasOtherEntries = filter.quays.length > 0
            return {
                id: quay.id,
                whitelistedLines: quayHasOtherEntries ? [] : allLineIds,
            }
        }),
    }
}

export function compressQuaysFilter(
    filter: QuaysFilterDB,
    quays: QuayWithFrontText[],
): QuaysFilterDB {
    const compactedQuays: QuaysFilterDB['quays'] = []

    for (const quay of filter.quays) {
        const selectedCount = quay.whitelistedLines.length
        if (selectedCount === 0) {
            continue
        }

        const possibleLinesCount =
            quays.find((q) => q.id === quay.id)?.lines.length ?? 0

        if (selectedCount === possibleLinesCount) {
            // Alt valgt på denne plattformen -> endre til tom list
            compactedQuays.push({ id: quay.id, whitelistedLines: [] })
            continue
        }

        // Delvis valgt -> behold den eksplisitte lista som den er
        compactedQuays.push(quay)
    }

    const everyQuayIsFullySelected =
        compactedQuays.length === quays.length &&
        compactedQuays.every((quay) => quay.whitelistedLines.length === 0)

    if (everyQuayIsFullySelected) {
        // Ingen valgt på noen plattformer -> bruk tom liste
        return { type: 'quaysFilter', quays: [] }
    }

    return { type: 'quaysFilter', quays: compactedQuays }
}
