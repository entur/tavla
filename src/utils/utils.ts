import { TranslatedString } from 'graphql-generated/mobility-v2'
import {
    Departure,
    EnturLogoStyle,
    EstimatedCall,
    Theme,
    TileSubLabel,
} from 'src/types'
import EnturBlack from 'assets/logos/EnturBlack.svg'
import EnturWhite from 'assets/logos/EnturWhite.svg'
import EnturContrast from 'assets/logos/EnturContrast.svg'
import { is, Struct } from 'superstruct'
import { compareAsc, differenceInMinutes, format, parseISO } from 'date-fns'
import { Settings } from 'settings/settings'
import { formatDepartureTime } from './formatting'

export function createTileSubLabel({
    situations,
    cancellation,
    displayTime,
    expectedDepartureTime,
}: Departure): TileSubLabel {
    const situation = situations[0]?.summary[0]?.value
    return {
        situation,
        hasSituation: Boolean(situation),
        hasCancellation: cancellation,
        displayTime,
        expectedDepartureTime,
    }
}

export function isDarkOrDefaultTheme(theme?: Theme): boolean {
    return !theme || theme === 'dark' || theme === 'default'
}

export function getTranslation(
    translationObject: TranslatedString,
    languageId = 'nb',
): string | null {
    const translations = translationObject?.translation
    const match = translations.find(
        (currentTranslation) => currentTranslation?.language === languageId,
    )
    if (!match) return null
    return match.value
}

export function enturLogo(style?: EnturLogoStyle) {
    switch (style) {
        case 'black':
            return EnturBlack
        case 'white':
            return EnturWhite
        default:
            return EnturContrast
    }
}

export function createAbortController():
    | AbortController
    | { signal: undefined; abort: () => void } {
    try {
        return new AbortController()
    } catch (error) {
        /**
         * AbortController is not supported by this browser.
         * We make a fake one that does nothing.
         */
        return {
            signal: undefined,
            abort: () => undefined,
        }
    }
}

export function toStruct<T>(obj: unknown, struct: Struct<T>): T | undefined {
    return is(obj, struct) ? obj : undefined
}

/**
 * Map EstimatedCall to Departure. Departure is similar to the old LineData-type.
 * @param estimatedCall
 */
export function toDeparture(estimatedCall: EstimatedCall): Departure {
    const line = estimatedCall.serviceJourney.journeyPattern.line
    const aimedDepartureTime = parseISO(estimatedCall.aimedDepartureTime)
    const expectedDepartureTime = parseISO(estimatedCall.expectedDepartureTime)

    const delayed =
        differenceInMinutes(expectedDepartureTime, aimedDepartureTime) > 1

    const timeUntilDeparture = differenceInMinutes(
        expectedDepartureTime,
        new Date(),
    )

    const displayTime = formatDepartureTime(
        timeUntilDeparture,
        expectedDepartureTime,
    )

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
export function filterHiddenRoutes(stopPlaceId: string, settings: Settings) {
    return (departure: Departure): boolean =>
        !settings.hiddenRoutes[stopPlaceId]?.includes(departure.route)
}

export function byDepartureTime(a: Departure, b: Departure) {
    return compareAsc(a.expectedDepartureTime, b.expectedDepartureTime)
}
