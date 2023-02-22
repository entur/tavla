import { TranslatedString } from 'graphql-generated/mobility-v2'
import { EnturLogoStyle, Theme, TileSubLabel } from 'src/types'
import EnturBlack from 'assets/logos/EnturBlack.svg'
import EnturWhite from 'assets/logos/EnturWhite.svg'
import EnturContrast from 'assets/logos/EnturContrast.svg'
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
