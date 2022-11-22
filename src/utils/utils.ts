import { TransportMode } from '../../graphql-generated/journey-planner-v3'
import { TranslatedString } from '../../graphql-generated/mobility-v2'
import { Theme, TileSubLabel } from '../types'
import { Departure } from '../logic/use-stop-place-with-estimated-calls/departure'

export function createTileSubLabel({
    situations,
    cancellation,
    time,
    departureTime,
}: Departure): TileSubLabel {
    const situation = situations[0]?.summary[0]?.value
    return {
        situation,
        hasSituation: Boolean(situation),
        hasCancellation: cancellation,
        time,
        departureTime,
    }
}

export const transportModeNameMapper = (mode: TransportMode): string => {
    switch (mode) {
        case 'bus':
            return 'Buss'
        case 'water':
            return 'Båt'
        case 'tram':
            return 'Trikk'
        case 'rail':
            return 'Tog'
        case 'metro':
            return 'T-bane'
        default:
            return 'Buss'
    }
}

export const isMobileWeb = (): boolean =>
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1

export function isDarkOrDefaultTheme(theme?: Theme): boolean {
    return !theme || theme === Theme.DARK || theme === Theme.DEFAULT
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
