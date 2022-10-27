import { TransportMode } from '@entur/sdk'
import { TranslatedString } from '../graphql-generated/mobility-v2'
import { LineData, Theme, TileSubLabel } from './types'

export function createTileSubLabel({
    situation,
    hasCancellation,
    time,
    departureTime,
}: LineData): TileSubLabel {
    return {
        situation,
        hasSituation: Boolean(situation),
        hasCancellation,
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
