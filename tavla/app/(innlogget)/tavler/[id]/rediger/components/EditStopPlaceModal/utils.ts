import { sortByTransportMode } from 'app/_components/TransportIcon/utils'
import type { TTransportMode } from 'src/types/graphql-schema'
import type {
    BoardTileDB,
    QuaysFilterDB,
    StopPlaceFilterDB,
} from 'types/db-types/boards'
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

export function getInitialFilterType(
    tile: BoardTileDB,
): 'stopPlaceFilter' | 'quaysFilter' {
    if (tile.filter?.type) return tile.filter.type
    if (tile.quays && tile.quays.length > 0) return 'quaysFilter'

    return 'stopPlaceFilter'
}

export function quaysToQuaysFilter(
    quays: { id: string; whitelistedLines: string[] }[],
): QuaysFilterDB {
    return {
        type: 'quaysFilter',
        quays: quays.map((quay) => ({
            id: quay.id,
            whitelistedLines: [...quay.whitelistedLines],
        })),
    }
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

export function getInitialQuaysFilter(
    tile: BoardTileDB,
    quays: QuayWithFrontText[],
): QuaysFilterDB {
    const initialFilter =
        tile.filter?.type === 'quaysFilter'
            ? tile.filter
            : quaysToQuaysFilter(tile.quays)

    return expandQuaysFilter(initialFilter, quays)
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

        const possibleLineIds =
            quays.find((q) => q.id === quay.id)?.lines.map((line) => line.id) ??
            []

        if (possibleLineIds.every((id) => quay.whitelistedLines.includes(id))) {
            // Alt valgt på denne plattformen -> endre til tom liste
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

export type TransportModeGroup = {
    mode: TTransportMode
    lines: LineWithFrontText[]
}

/**
 * Grupperer linjer på tvers av alle plattformer etter transportmiddel.
 * En linje som betjener flere plattformer vises kun i én gruppe, med
 * frontTexts slått sammen fra alle plattformene den betjener.
 *
 * @param quays Liste over plattformer med linjer
 * @returns Grupperte linjer etter transportmiddel
 */
export function groupLinesByTransportMode(
    quays: QuayWithFrontText[],
): TransportModeGroup[] {
    const allLinesAndFrontTexts = quays.flatMap((quay) => quay.lines)
    const consolidatedLinesById = combineUniqueLines(allLinesAndFrontTexts)

    const modeOf = (line: LineWithFrontText) => line.transportMode ?? 'unknown'
    const modes = Array.from(new Set(consolidatedLinesById.map(modeOf)))

    const grouped = modes
        .map((mode) => ({
            mode,
            lines: consolidatedLinesById.filter(
                (line) => modeOf(line) === mode,
            ),
        }))
        .sort((a, b) =>
            sortByTransportMode(
                { transportMode: a.mode },
                { transportMode: b.mode },
            ),
        )

    return grouped
}

/**
 * Slår sammen linjer med samme id til én linje. Den første forekomsten
 * beholdes, og får frontTexts fra alle forekomstene uten duplikater.
 *
 * @param lines Linjer som kan inneholde samme linje flere ganger
 * @returns En liste med unike linjer, én per id, med frontTexts slått sammen uten duplikater.
 */
function combineUniqueLines(lines: LineWithFrontText[]): LineWithFrontText[] {
    const firstOccurrences = lines.filter(
        (line, index) => lines.findIndex((l) => l.id === line.id) === index,
    )

    return firstOccurrences.map((line) => ({
        ...line,
        frontTexts: Array.from(
            new Set(
                lines
                    .filter((l) => l.id === line.id)
                    .flatMap((l) => l.frontTexts),
            ),
        ),
    }))
}

export function expandStopPlaceFilter(
    filter: StopPlaceFilterDB,
    groups: TransportModeGroup[],
): StopPlaceFilterDB {
    const hasFiltrations =
        filter.whitelistedModes.length > 0 || filter.whitelistedLines.length > 0

    if (!hasFiltrations) {
        return {
            type: 'stopPlaceFilter',
            whitelistedModes: [],
            whitelistedLines: groups.flatMap((group) =>
                group.lines.map((line) => line.id),
            ),
        }
    }

    const selectedLineIds = new Set(filter.whitelistedLines)
    for (const mode of filter.whitelistedModes) {
        const group = groups.find((g) => g.mode === mode)
        if (!group) continue
        for (const line of group.lines) selectedLineIds.add(line.id)
    }

    return {
        type: 'stopPlaceFilter',
        whitelistedModes: [],
        whitelistedLines: Array.from(selectedLineIds),
    }
}

export function getInitialStopPlaceFilter(
    tile: BoardTileDB,
    quays: QuayWithFrontText[],
): StopPlaceFilterDB {
    const initialFilter: StopPlaceFilterDB =
        tile.filter?.type === 'stopPlaceFilter'
            ? tile.filter
            : {
                  type: 'stopPlaceFilter',
                  whitelistedModes: [],
                  whitelistedLines: [],
              }

    return expandStopPlaceFilter(
        initialFilter,
        groupLinesByTransportMode(quays),
    )
}

export function compressStopPlaceFilter(
    filter: StopPlaceFilterDB,
    quays: QuayWithFrontText[],
): StopPlaceFilterDB {
    const groups = groupLinesByTransportMode(quays)
    const selectedLineIds = new Set(filter.whitelistedLines)
    const allLineIds = groups.flatMap((group) =>
        group.lines.map((line) => line.id),
    )

    const everythingSelected =
        allLineIds.length > 0 &&
        allLineIds.every((id) => selectedLineIds.has(id))

    if (everythingSelected) {
        // Alt valgt på stoppestedet -> bruk tomme lister
        return {
            type: 'stopPlaceFilter',
            whitelistedModes: [],
            whitelistedLines: [],
        }
    }

    const whitelistedModes: TTransportMode[] = []
    const whitelistedLines: string[] = []

    for (const group of groups) {
        const groupLineIds = group.lines.map((line) => line.id)
        const selectedInGroup = groupLineIds.filter((id) =>
            selectedLineIds.has(id),
        )
        if (selectedInGroup.length === 0) continue

        if (selectedInGroup.length === groupLineIds.length) {
            whitelistedModes.push(group.mode)
        } else {
            whitelistedLines.push(...selectedInGroup)
        }
    }

    return { type: 'stopPlaceFilter', whitelistedModes, whitelistedLines }
}
