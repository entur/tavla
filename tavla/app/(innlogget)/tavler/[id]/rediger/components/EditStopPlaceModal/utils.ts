import { sortByTransportMode } from 'app/_components/TransportIcon/utils'
import type {
    TTransportMode,
    TTransportSubmode,
} from 'src/types/graphql-schema'
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

/**
 * Norsk visningsnavn for en transport-undermodus. Returnerer null for
 * undermoduser vi ikke har en god norsk oversettelse for ennå.
 */
export function transportSubmodeNames(
    submode: TTransportSubmode | null | undefined,
): string | null {
    switch (submode) {
        // Buss
        case 'localBus':
            return 'Lokal buss'
        case 'nightBus':
            return 'Nattbuss'
        case 'regionalBus':
            return 'Regionbuss'
        case 'expressBus':
            return 'Ekspressbuss'
        case 'airportLinkBus':
            return 'Flybuss'
        case 'railReplacementBus':
            return 'Buss for tog'
        case 'schoolBus':
            return 'Skolebuss'
        case 'shuttleBus':
            return 'Shuttlebuss'
        case 'sightseeingBus':
            return 'Turistbuss'
        case 'demandAndResponseBus':
            return 'Bestillingsbuss'
        case 'specialNeedsBus':
        case 'mobilityBus':
        case 'mobilityBusForRegisteredDisabled':
            return 'Tilrettelagt transport'
        case 'dedicatedLaneBus':
            return 'Superbuss'
        case 'highFrequencyBus':
            return 'Høyfrekvent buss'
        // Langdistansebuss/ekspressbuss (coach)
        case 'commuterCoach':
            return 'Ekspressbuss'
        case 'internationalCoach':
            return 'Internasjonal langdistansebuss'
        case 'nationalCoach':
            return 'Langdistansebuss'
        case 'regionalCoach':
            return 'Regional langdistansebuss'
        case 'touristCoach':
        case 'sightseeingCoach':
            return 'Turistbuss'
        case 'specialCoach':
            return 'Spesialbuss'
        case 'shuttleCoach':
            return 'Flybuss'
        // Tog
        case 'local':
        case 'suburbanRailway':
            return 'Lokaltog'
        case 'longDistance':
            return 'Fjerntog'
        case 'regionalRail':
            return 'Regiontog'
        case 'interregionalRail':
            return 'InterCity-tog'
        case 'highSpeedRail':
            return 'Hurtigtog'
        case 'nightRail':
            return 'Nattog'
        case 'railShuttle':
            return 'Flytog'
        // Trikk
        case 'localTram':
            return 'Lokal trikk'
        case 'cityTram':
            return 'Bytrikk'
        case 'regionalTram':
            return 'Regiontrikk'
        case 'sightseeingTram':
            return 'Turisttrikk'
        case 'shuttleTram':
            return 'Shuttletrikk'
        case 'trainTram':
            return 'Tog-trikk'
        // Båt
        case 'internationalPassengerFerry':
            return 'Internasjonal ferge'
        case 'nationalPassengerFerry':
            return 'Nasjonal ferge'
        case 'regionalPassengerFerry':
            return 'Regional ferge'
        case 'localPassengerFerry':
            return 'Lokal ferge'
        case 'localCarFerry':
        case 'nationalCarFerry':
        case 'internationalCarFerry':
        case 'regionalCarFerry':
            return 'Bilferge'
        case 'highSpeedPassengerService':
            return 'Hurtigbåt'
        case 'postBoat':
            return 'Postbåt'
        case 'schoolBoat':
            return 'Skolebåt'
        case 'riverBus':
            return 'Elvebuss'
        // T-bane
        case 'metro':
        case 'tube':
        case 'urbanRailway':
            return 'T-bane'
        // Taubane/kabelbane
        case 'funicular':
        case 'allFunicularServices':
        case 'undefinedFunicular':
            return 'Taubane'
        case 'cableCar':
        case 'streetCableCar':
            return 'Kabelbane'
        case 'telecabin':
        case 'telecabinLink':
            return 'Gondol'
        case 'chairLift':
            return 'Stolheis'
        case 'dragLift':
            return 'Skitrekk'
        default:
            return null
    }
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
                    selectedLines:
                        quayFilter.selectedLines.length === 0
                            ? allLineIds
                            : quayFilter.selectedLines,
                }
            }

            const quayHasOtherEntries = filter.quays.length > 0
            return {
                id: quay.id,
                selectedLines: quayHasOtherEntries ? [] : allLineIds,
            }
        }),
    }
}

export function getInitialQuaysFilter(
    tile: BoardTileDB,
    quays: QuayWithFrontText[],
): QuaysFilterDB {
    const initialFilter: QuaysFilterDB =
        tile.filter?.type === 'quaysFilter'
            ? tile.filter
            : { type: 'quaysFilter', quays: [] }

    return expandQuaysFilter(initialFilter, quays)
}

export function compressQuaysFilter(
    filter: QuaysFilterDB,
    quays: QuayWithFrontText[],
): QuaysFilterDB {
    const compactedQuays: QuaysFilterDB['quays'] = []

    for (const quay of filter.quays) {
        const selectedCount = quay.selectedLines.length
        if (selectedCount === 0) {
            continue
        }

        const possibleLineIds =
            quays.find((q) => q.id === quay.id)?.lines.map((line) => line.id) ??
            []

        if (possibleLineIds.every((id) => quay.selectedLines.includes(id))) {
            // Alt valgt på denne plattformen -> endre til tom liste
            compactedQuays.push({ id: quay.id, selectedLines: [] })
            continue
        }

        // Delvis valgt -> behold den eksplisitte lista som den er
        compactedQuays.push(quay)
    }

    const everyQuayIsFullySelected =
        compactedQuays.length === quays.length &&
        compactedQuays.every((quay) => quay.selectedLines.length === 0)

    if (everyQuayIsFullySelected) {
        // Ingen valgt på noen plattformer -> bruk tom liste
        return { type: 'quaysFilter', quays: [] }
    }

    return { type: 'quaysFilter', quays: compactedQuays }
}

export type SubmodeGroup = {
    groupId: string
    submode: TTransportSubmode | null
    lines: LineWithFrontText[]
}

export type TransportModeGroup = {
    mode: TTransportMode
    lines: LineWithFrontText[]
    /**
     * Linjene i denne gruppa delt opp etter undermodus. Kun fylt ut når
     * gruppa faktisk inneholder 2 eller flere ulike undermoduser - ellers
     * gir en ekstra nøstingsnivå ingen verdi, og UI skal vise gruppa flatt.
     */
    submodeGroups: SubmodeGroup[]
}

function submodeGroupId(
    mode: TTransportMode,
    submode: TTransportSubmode | null,
): string {
    return `${mode}__${submode ?? 'ukjent'}`
}

function groupLinesBySubmode(
    mode: TTransportMode,
    lines: LineWithFrontText[],
): SubmodeGroup[] {
    const submodes = Array.from(
        new Set(lines.map((line) => line.transportSubmode ?? null)),
    )

    if (submodes.length < 2) {
        return []
    }

    return submodes
        .map((submode) => ({
            groupId: submodeGroupId(mode, submode),
            submode,
            lines: lines.filter(
                (line) => (line.transportSubmode ?? null) === submode,
            ),
        }))
        .sort((a, b) =>
            (transportSubmodeNames(a.submode) ?? '￿').localeCompare(
                transportSubmodeNames(b.submode) ?? '￿',
            ),
        )
}

/**
 * Grupperer linjer på tvers av alle plattformer etter transportmiddel, og
 * videre etter undermodus innad i hver transportmiddel-gruppe (f.eks. lokal-
 * og nattbuss under "Buss"). En linje som betjener flere plattformer vises
 * kun i én gruppe, med frontTexts slått sammen fra alle plattformene den
 * betjener.
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
        .map((mode) => {
            const lines = consolidatedLinesById.filter(
                (line) => modeOf(line) === mode,
            )

            return {
                mode,
                lines,
                submodeGroups: groupLinesBySubmode(mode, lines),
            }
        })
        .sort((a, b) =>
            sortByTransportMode(
                { transportMode: a.mode },
                { transportMode: b.mode },
            ),
        )

    return grouped
}

/**
 * Finner linje-id-ene til en gruppe, enten den er en transportmiddel-gruppe
 * (groupId = mode, f.eks. "bus") eller en nøstet undermodus-gruppe
 * (groupId = `${mode}__${submode}`, se submodeGroupId).
 */
export function getGroupLineIds(
    groupId: string,
    groups: TransportModeGroup[],
): string[] {
    for (const group of groups) {
        if (group.mode === groupId) {
            return group.lines.map((line) => line.id)
        }

        const submodeGroup = group.submodeGroups.find(
            (sub) => sub.groupId === groupId,
        )
        if (submodeGroup) {
            return submodeGroup.lines.map((line) => line.id)
        }
    }

    return []
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
        filter.selectedTransportModes.length > 0 ||
        filter.selectedLines.length > 0

    if (!hasFiltrations) {
        return {
            type: 'stopPlaceFilter',
            selectedTransportModes: [],
            selectedLines: groups.flatMap((group) =>
                group.lines.map((line) => line.id),
            ),
        }
    }

    const lineIdsFromSelectedModes = groups
        .filter((group) => filter.selectedTransportModes.includes(group.mode))
        .flatMap((group) => group.lines.map((line) => line.id))

    const allSelectedLineIds = [
        ...filter.selectedLines,
        ...lineIdsFromSelectedModes,
    ]

    return {
        type: 'stopPlaceFilter',
        selectedTransportModes: [],
        selectedLines: allSelectedLineIds,
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
                  selectedTransportModes: [],
                  selectedLines: [],
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
    const selectedLineIds = new Set(filter.selectedLines)
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
            selectedTransportModes: [],
            selectedLines: [],
        }
    }

    const selectedTransportModes: TTransportMode[] = []
    const selectedLines: string[] = []

    for (const group of groups) {
        const groupLineIds = group.lines.map((line) => line.id)
        const selectedInGroup = groupLineIds.filter((id) =>
            selectedLineIds.has(id),
        )
        if (selectedInGroup.length === 0) continue

        if (selectedInGroup.length === groupLineIds.length) {
            selectedTransportModes.push(group.mode)
        } else {
            selectedLines.push(...selectedInGroup)
        }
    }

    return { type: 'stopPlaceFilter', selectedTransportModes, selectedLines }
}
