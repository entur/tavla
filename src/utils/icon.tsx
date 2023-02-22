import React from 'react'
import { uniqWith } from 'lodash'
import { Departure, IconColorType, Theme } from 'src/types'
import {
    Mode,
    TransportMode,
    TransportSubmode,
} from 'graphql-generated/journey-planner-v3'
import { TransportModeIcon } from 'components/TransportModeIcon/TransportModeIcon'
import { colors } from '@entur/tokens'
import { isNotNullOrUndefined } from './typeguards'

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

function getTransportHeaderIcons(
    departures: Departure[],
    iconColorType: IconColorType,
): JSX.Element[] {
    return uniqWith(
        departures,
        (a, b) =>
            getTransportIconIdentifier(a.transportMode, a.transportSubmode) ===
            getTransportIconIdentifier(b.transportMode, b.transportSubmode),
    )
        .map(({ transportMode, transportSubmode }) => (
            <TransportModeIcon
                key={transportMode}
                transportMode={transportMode}
                iconColorType={iconColorType}
                transportSubmode={transportSubmode}
            />
        ))
        .filter(isNotNullOrUndefined)
}

function getIconColorType(theme: Theme | undefined): IconColorType {
    if (!theme) return IconColorType.CONTRAST
    const defaultThemes = [Theme.LIGHT, Theme.GREY]
    if (defaultThemes.includes(theme)) {
        return IconColorType.DEFAULT
    }
    return IconColorType.CONTRAST
}

function getIconColor(
    type: TransportMode | Mode | 'ferry',
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

function getTransportIconIdentifier(
    legMode: TransportMode | Mode,
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

export {
    getIconColorType,
    getIconColor,
    getTransportHeaderIcons,
    getTransportIconIdentifier,
}
