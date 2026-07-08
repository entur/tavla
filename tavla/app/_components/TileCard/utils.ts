import type { TTransportMode } from 'src/types/graphql-schema'
import type { LineWithDirectionDB, TileColumnDB } from 'types/db-types/boards'
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

/**
 *
 * @param quays The quays with all lines and frontTexts
 * @param selectedQuayLineKeys The currently selected quay-line pairs, in the
 * form of `${quayId}||${lineId}`.
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

    for (const quay of quays) {
        for (const line of quay.lines) {
            const frontTexts = line.frontTexts ?? []

            const known = knownFrontTexts.get(line.id) ?? new Set<string>()
            for (const frontText of frontTexts) known.add(frontText)
            knownFrontTexts.set(line.id, known)

            if (selectedLineIds.has(`${quay.id}||${line.id}`)) {
                const chosen =
                    selectedFrontTexts.get(line.id) ?? new Set<string>()
                for (const frontText of frontTexts) chosen.add(frontText)
                selectedFrontTexts.set(line.id, chosen)
            }
        }
    }

    return Array.from(selectedFrontTexts.entries()).map(([lineId, chosen]) => {
        const known = knownFrontTexts.get(lineId) ?? new Set<string>()
        const allDirectionsChosen =
            known.size > 0 &&
            chosen.size >= known.size &&
            Array.from(known).every((frontText) => chosen.has(frontText))

        return {
            lineId,
            frontTexts: allDirectionsChosen ? [] : Array.from(chosen).sort(),
        }
    })
}
