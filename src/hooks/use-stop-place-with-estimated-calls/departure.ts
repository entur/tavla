import { compareAsc, differenceInMinutes, format, parseISO } from 'date-fns'
import { Settings } from 'settings/settings'
import { Departure } from 'src/types'
import { EstimatedCall } from './types'

function formatTime(minDiff: number, departureTime: Date): string {
    if (minDiff > 15) return format(departureTime, 'HH:mm')
    return minDiff < 1 ? 'Nå' : `${minDiff} min`
}

/**
 * Map EstimatedCall to Departure. Departure is similar to the old LineData-type.
 * @param estimatedCall
 */
function toDeparture(estimatedCall: EstimatedCall): Departure {
    const line = estimatedCall.serviceJourney.journeyPattern.line
    const aimedDepartureTime = parseISO(estimatedCall.aimedDepartureTime)
    const expectedDepartureTime = parseISO(estimatedCall.expectedDepartureTime)

    const delayed =
        differenceInMinutes(expectedDepartureTime, aimedDepartureTime) > 1

    const timeUntilDeparture = differenceInMinutes(
        expectedDepartureTime,
        new Date(),
    )

    const displayTime = formatTime(timeUntilDeparture, expectedDepartureTime)

    return {
        id: `${estimatedCall.date}::${estimatedCall.aimedDepartureTime}::${estimatedCall.serviceJourney.id}`,
        aimedDepartureTime,
        expectedDepartureTime,
        formattedAimedDepartureTime: format(aimedDepartureTime, 'HH:mm'),
        formattedExpectedDepartureTime: format(expectedDepartureTime, 'HH:mm'),
        delayed,
        displayTime,
        transportMode: line.transportMode,
        transportSubmode: estimatedCall.serviceJourney.transportSubmode,
        publicCode: line.publicCode || '',
        frontText: estimatedCall.destinationDisplay.frontText,
        route: `${line.publicCode || ''} ${
            estimatedCall.destinationDisplay.frontText
        }`.trim(),
        situations: estimatedCall.situations,
        cancellation: estimatedCall.cancellation,
        quay: estimatedCall.quay,
    }
}

/**
 * Create higher-order function that filters departures based on settings.hiddenRoutes
 * @param stopPlaceId
 * @param settings
 */
const filterHidden =
    (stopPlaceId: string, settings: Settings) =>
    (departure: Departure): boolean =>
        !settings.hiddenRoutes[stopPlaceId]?.includes(departure.route)

const byDepartureTime = (a: Departure, b: Departure) =>
    compareAsc(a.expectedDepartureTime, b.expectedDepartureTime)

export { toDeparture, filterHidden, byDepartureTime }
