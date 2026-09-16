import type { TTransportMode } from 'src/types/graphql-schema'
import type {
    BoardTileDB,
    LineWithDirectionDB,
    TileColumnDB,
} from 'types/db-types/boards'
import type { QuayWithFrontText } from './types'

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

export type TileFormValues = {
    columns: TileColumnDB[]
    count: number | null
    offset: number | null
    displayName: string
    quayLineKeys: string[]
    linesWithDirection: LineWithDirectionDB[]
}

export function parseTileFormData(data: FormData): TileFormValues {
    const columns = data.getAll('columns') as TileColumnDB[]
    data.delete('columns')
    const countRaw = data.get('count')
    const count = countRaw !== null ? Number(countRaw) : null
    data.delete('count')
    const offset = data.get('offset') as number | null
    data.delete('offset')
    const displayName = data.get('displayName') as string
    data.delete('displayName')

    const linesWithDirectionRaw = data.get('linesWithDirection') as
        | string
        | null
    data.delete('linesWithDirection')
    const linesWithDirection: LineWithDirectionDB[] = JSON.parse(
        linesWithDirectionRaw ?? '[]',
    )

    const quayLineKeys: string[] = []
    for (const value of data.values()) {
        quayLineKeys.push(value as string)
    }

    return {
        columns,
        count,
        offset,
        displayName,
        quayLineKeys,
        linesWithDirection,
    }
}

export function generateQuayLineFrontTextKey(
    quayId: string,
    lineId: string,
    frontText?: string | null,
): string {
    return frontText
        ? `${quayId}||${lineId}||${frontText}`
        : `${quayId}||${lineId}`
}

/**
 *
 * @param quays The quays with all lines and frontTexts
 * @param selectedQuayLineKeys The currently selected quay-line(-frontText) pairs, in the
 * form of `${quayId}||${lineId}` or `${quayId}||${lineId}||${frontText}` for lines with known directions
 *
 * @returns A list of lines with their selected directions (frontTexts). If all
 * known directions of a line are selected, the line is returned with an empty
 * `frontTexts` array, meaning "all directions"
 *
 */
export function deriveLinesWithDirection(
    quays: QuayWithFrontText[],
    selectedQuayLineKeys: string[],
): LineWithDirectionDB[] {
    const selectedLineIds = new Set(selectedQuayLineKeys)
    const selectedFrontTexts = new Map<string, Set<string>>()
    const knownFrontTexts = new Map<string, Set<string>>()
    const linesWithAnySelection = new Set<string>()

    for (const quay of quays) {
        for (const line of quay.lines) {
            const frontTexts = line.frontTexts

            if (frontTexts.length === 0) {
                const key = generateQuayLineFrontTextKey(quay.id, line.id)
                if (selectedLineIds.has(key)) {
                    linesWithAnySelection.add(line.id)
                }
                continue
            }

            const known = knownFrontTexts.get(line.id) ?? new Set<string>()
            for (const frontText of frontTexts) known.add(frontText)
            knownFrontTexts.set(line.id, known)

            for (const frontText of frontTexts) {
                const key = generateQuayLineFrontTextKey(
                    quay.id,
                    line.id,
                    frontText,
                )

                if (!selectedLineIds.has(key)) continue

                linesWithAnySelection.add(line.id)
                if (frontText) {
                    const chosen =
                        selectedFrontTexts.get(line.id) ?? new Set<string>()
                    chosen.add(frontText)
                    selectedFrontTexts.set(line.id, chosen)
                }
            }
        }
    }

    return Array.from(linesWithAnySelection).map((lineId) => {
        const known = knownFrontTexts.get(lineId) ?? new Set<string>()
        const chosen = selectedFrontTexts.get(lineId) ?? new Set<string>()
        const allDirectionsChosen =
            known.size === 0 ||
            (chosen.size >= known.size &&
                Array.from(known).every((frontText) => chosen.has(frontText)))

        return {
            lineId,
            frontTexts: allDirectionsChosen ? [] : Array.from(chosen).sort(),
        }
    })
}

export function countSelectableQuayLineKeys(
    quays: QuayWithFrontText[],
): number {
    return quays.reduce(
        (sum, quay) =>
            sum +
            quay.lines.reduce(
                (lineSum, l) => lineSum + (l.frontTexts.length || 1),
                0,
            ),
        0,
    )
}

/**
 * Adds a quay-line(-frontText) key to the set. If the line has no known directions,
 * the key is added without a frontText. If the line has known directions, a key
 * is added for each frontText.
 */
function addLineKeys(
    set: Set<string>,
    quayId: string,
    lineId: string,
    frontTexts: string[] | undefined,
): void {
    if (!frontTexts || frontTexts.length === 0) {
        set.add(generateQuayLineFrontTextKey(quayId, lineId))
        return
    }
    for (const frontText of frontTexts) {
        set.add(generateQuayLineFrontTextKey(quayId, lineId, frontText))
    }
}

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
                    addLineKeys(set, quay.id, l.id, l.frontTexts)
                }
            } else {
                for (const lineId of savedQuay.whitelistedLines) {
                    const line = quay.lines.find((l) => l.id === lineId)
                    if (!line) continue
                    addLineKeys(set, quay.id, line.id, line.frontTexts)
                }
            }
        } else if (hasQuayFilter) {
            // Per-quay filter exists but this quay has no entry: nothing selected
        } else if (tile.whitelistedLines && tile.whitelistedLines.length > 0) {
            for (const l of quay.lines) {
                if (tile.whitelistedLines?.includes(l.id)) {
                    addLineKeys(set, quay.id, l.id, l.frontTexts)
                }
            }
        } else {
            for (const l of quay.lines) {
                addLineKeys(set, quay.id, l.id, l.frontTexts)
            }
        }
    }

    return set
}
