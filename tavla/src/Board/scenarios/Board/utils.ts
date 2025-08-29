import { sortPublicCodes } from 'app/(admin)/tavler/[id]/rediger/components/TileCard/utils'
import { TDepartureFragment, TSituationFragment } from 'graphql/index'
import { TTransportMode } from 'types/graphql-schema'
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

export function filterOutStopPlaceSituations(
    stopPlaceSituations?: TSituationFragment[],
    departureSituations?: TSituationFragment[],
) {
    if (!stopPlaceSituations || !departureSituations) {
        return departureSituations ?? []
    }

    const filteredSituations = departureSituations.filter(
        (departureSituation) =>
            !stopPlaceSituations.some(
                (stopPlaceSituation) =>
                    departureSituation.id === stopPlaceSituation.id,
            ),
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
        publicCode: string | null
        transportMode: TTransportMode
    }[],
) {
    if (!situationsPerDepartureWithCancellation) return null

    const situationById: {
        [id: string]: {
            situation: TSituationFragment
            cancellation: boolean
            publicCodeList: string[]
            transportModeList: TTransportMode[]
        }
    } = {}

    situationsPerDepartureWithCancellation.map((situations) => {
        situations.situations.map((situation) => {
            const id = situation.id
            if (situationById[id] === undefined) {
                situationById[id] = {
                    situation: situation,
                    cancellation: situations.cancellation,
                    publicCodeList: situations.publicCode
                        ? [situations.publicCode]
                        : [],
                    transportModeList: [
                        situations.transportMode as TTransportMode,
                    ],
                }
            } else {
                if (
                    situations.publicCode &&
                    situationById[id].publicCodeList.indexOf(
                        situations.publicCode,
                    ) === -1
                )
                    situationById[id].publicCodeList.push(situations.publicCode)
                if (
                    situationById[id].transportModeList.indexOf(
                        situations.transportMode as TTransportMode,
                    ) === -1
                ) {
                    situationById[id].transportModeList.push(
                        situations.transportMode as TTransportMode,
                    )
                }
            }
            situationById[id].publicCodeList.sort(sortPublicCodes)
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
                situations: filterOutStopPlaceSituations(
                    situations,
                    departure.situations,
                ),
                publicCode: departure.serviceJourney.line.publicCode,
                transportMode:
                    departure.serviceJourney.transportMode ?? 'unknown',
                cancellation: departure.cancellation,
            }))
            .filter((situation) => situation.situations.length !== 0)

    const combinedSituationsWithCancellations =
        combineSituationsWithCancellationInfo(
            situationsPerDepartureWithCancellation,
        )

    return combinedSituationsWithCancellations
}
