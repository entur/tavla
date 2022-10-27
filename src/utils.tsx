import React from 'react'
import {
    BicycleIcon,
    BusIcon,
    CarferryIcon,
    FerryIcon,
    PlaneIcon,
    SubwayIcon,
    TrainIcon,
    TramIcon,
} from '@entur/icons'
import { colors } from '@entur/tokens'
import { LegMode, TransportMode, TransportSubmode } from '@entur/sdk'
import { TranslatedString } from '../graphql-generated/mobility-v2'
import { IconColorType, LineData, Theme, TileSubLabel } from './types'

export const EMAIL_REGEX =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

function isSubModeAirportLink(subMode?: string): boolean {
    if (!subMode) return false
    const airportLinkTypes = ['airportLinkRail', 'airportLinkBus']
    return airportLinkTypes.includes(subMode)
}

function isSubModeCarFerry(subMode?: string): boolean {
    if (!subMode) return false
    const carFerryTypes = [
        'localCarFerry',
        'internationalCarFerry',
        'nationalCarFerry',
        'regionalCarFerry',
    ]

    return carFerryTypes.includes(subMode)
}

export function getIconColorType(theme: Theme | undefined): IconColorType {
    if (!theme) return IconColorType.CONTRAST
    const defaultThemes = [Theme.LIGHT, Theme.GREY]
    if (defaultThemes.includes(theme)) {
        return IconColorType.DEFAULT
    }
    return IconColorType.CONTRAST
}

export function getIconColor(
    type: TransportMode | LegMode | 'ferry',
    iconColorType: IconColorType,
    subType?: TransportSubmode,
): string {
    if (isSubModeAirportLink(subType)) {
        return colors.transport[iconColorType].plane
    }
    switch (type) {
        case 'bus':
            return colors.transport[iconColorType].bus
        case 'bicycle':
            return colors.transport[iconColorType].mobility
        case 'water':
        case 'ferry':
            return colors.transport[iconColorType].ferry
        case 'metro':
            return colors.transport[iconColorType].metro
        case 'rail':
            return colors.transport[iconColorType].train
        case 'tram':
            return colors.transport[iconColorType].tram
        case 'air':
            return colors.transport[iconColorType].plane
        default:
            return colors.transport[iconColorType].walk
    }
}

type TransportIconIdentifier =
    | 'carferry'
    | 'bus'
    | 'bicycle'
    | 'ferry'
    | 'subway'
    | 'train'
    | 'tram'
    | 'plane'

export function getTransportIconIdentifier(
    legMode: TransportMode | LegMode,
    subMode?: TransportSubmode,
): TransportIconIdentifier | null {
    if (isSubModeCarFerry(subMode)) {
        return 'carferry'
    }

    switch (legMode) {
        case 'bus':
        case 'coach':
            return 'bus'
        case 'bicycle':
            return 'bicycle'
        case 'water':
            return 'ferry'
        case 'metro':
            return 'subway'
        case 'rail':
            return 'train'
        case 'tram':
            return 'tram'
        case 'air':
            return 'plane'
        default:
            return null
    }
}

export const BREAKPOINTS = {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0,
}

export function getIcon(
    mode: TransportMode,
    iconColorType: IconColorType = IconColorType.CONTRAST,
    subMode?: TransportSubmode,
    color?: string,
): JSX.Element | null {
    const colorToUse = color ?? getIconColor(mode, iconColorType, subMode)

    const identifier = getTransportIconIdentifier(mode, subMode)

    switch (identifier) {
        case 'bus':
            return <BusIcon key={identifier} color={colorToUse} />
        case 'bicycle':
            return <BicycleIcon key={identifier} color={colorToUse} />
        case 'carferry':
            return <CarferryIcon key={identifier} color={colorToUse} />
        case 'ferry':
            return <FerryIcon key={identifier} color={colorToUse} />
        case 'subway':
            return <SubwayIcon key={identifier} color={colorToUse} />
        case 'train':
            return <TrainIcon key={identifier} color={colorToUse} />
        case 'tram':
            return <TramIcon key={identifier} color={colorToUse} />
        case 'plane':
            return <PlaneIcon key={identifier} color={colorToUse} />
        default:
            return null
    }
}

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
