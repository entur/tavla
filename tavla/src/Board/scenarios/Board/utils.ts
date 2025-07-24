import { TDepartureFragment, TSituationFragment } from 'graphql/index'
import { TFontSize } from 'types/meta'
import { TBoard } from 'types/settings'
export function getFontScale(fontSize: TFontSize | undefined) {
    switch (fontSize) {
        case 'small':
            return 'text-em-sm'
        case 'medium':
            return 'text-em-base'
        case 'large':
            return 'text-em-lg'
        default:
            return 'text-em-base'
    }
}
export function defaultFontSize(board: TBoard) {
    if (!board.tiles || board.tiles.length === 0) return 'medium'

    switch (board.tiles.length) {
        case 1:
            return 'large'
        case 2:
            return 'medium'
        default:
            return 'small'
    }
}

export function filterSituationsFromChosenStop(
    originSituations?: TSituationFragment[],
    departureSituations?: TSituationFragment[],
) {
    if (!originSituations || !departureSituations) {
        return departureSituations ?? []
    }

    const filteredSituations = departureSituations.filter(
        (departureSituation) => {
            let shouldKeep = true
            originSituations.map((originSituation) => {
                if (departureSituation.id === originSituation.id) {
                    shouldKeep = false
                    return
                }
            })
            return shouldKeep
        },
    )

    return filteredSituations
}

export function combineSituations(situations: TSituationFragment[]) {
    const situationById: { [id: string]: TSituationFragment } = {}

    situations.map((situation) => {
        const id = situation.id
        if (situationById[id]) {
            const existingOrigins = situationById[id].origin
                ?.split(', ')
                .concat([situation.origin ?? ''])
                .sort()

            situationById[id].origin = existingOrigins?.join(', ')
        } else {
            situationById[id] = situation
        }
    })

    return Object.values(situationById)
}

function combineSituationsWithCancellationInfo(
    situationsPerDepartureWithCancellation?: {
        situations: TSituationFragment[]
        cancellation: boolean
    }[],
) {
    if (!situationsPerDepartureWithCancellation) return null

    const situationById: {
        [id: string]: { situation: TSituationFragment; cancellation: boolean }
    } = {}

    situationsPerDepartureWithCancellation.map((situations) => {
        situations.situations.map((situation) => {
            const id = situation.id
            if (situationById[id] === undefined) {
                situationById[id] = {
                    situation: situation,
                    cancellation: situations.cancellation,
                }
            }
        })
    })

    return Object.values(situationById)
}

export function getUniqueSituationsFromDepartures(
    departures?: TDepartureFragment[],
    situations?: TSituationFragment[],
) {
    const situationsPerDepartureWithCancellation =
        departures &&
        departures
            .map((departure) => ({
                situations: filterSituationsFromChosenStop(
                    situations,
                    departure.situations,
                ),
                cancellation: departure.cancellation,
            }))
            .filter((situation) => situation.situations.length !== 0)

    const combinedSituationsWithCancellations =
        combineSituationsWithCancellationInfo(
            situationsPerDepartureWithCancellation,
        )

    return combinedSituationsWithCancellations
}
