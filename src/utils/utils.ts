import { TranslatedString } from 'graphql-generated/mobility-v2'
import { Theme, TileSubLabel } from 'src/types'
import { Departure } from 'hooks/use-stop-place-with-estimated-calls/departure'

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
