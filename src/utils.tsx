import React, { useState, useEffect, useRef } from 'react'

import differenceInSeconds from 'date-fns/differenceInSeconds'
import differenceInMinutes from 'date-fns/differenceInMinutes'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

import {
    BicycleIcon,
    BusIcon,
    FerryIcon,
    SubwayIcon,
    TrainIcon,
    TramIcon,
    PlaneIcon,
    CarferryIcon,
    CloudLightningIcon,
    SunCloudRainIcon,
    CloudSnowIcon,
    CloudRainIcon,
    SunCloudIcon,
    CloudIcon,
    SunIcon,
} from '@entur/icons'

import { colors } from '@entur/tokens'

import { Departure, LegMode, TransportMode, TransportSubmode } from '@entur/sdk'
import { TranslatedString, Translation } from '@entur/sdk/lib/mobility/types'

import { LineData, TileSubLabel, Theme, IconColorType } from './types'
import { useSettingsContext } from './settings'

export function isNotNullOrUndefined<T>(
    thing: T | undefined | null,
): thing is T {
    return thing !== undefined && thing !== null
}

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

export function groupBy<T extends { [key: string]: any }>(
    objectArray: T[],
    property: keyof T,
): { [key: string]: T[] } {
    return objectArray.reduce((acc, obj) => {
        const key = obj[property]
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(obj)
        return acc
    }, {} as { [key: string]: any })
}

function formatDeparture(minDiff: number, departureTime: Date): string {
    if (minDiff > 15) return format(departureTime, 'HH:mm')
    return minDiff < 1 ? 'Nå' : `${minDiff} min`
}

export function unique<T>(
    array: T[],
    isEqual: (a: T, b: T) => boolean = (a, b): boolean => a === b,
): T[] {
    return array.filter((item, index, items) => {
        const previousItems = items.slice(0, index)
        return !previousItems.some((uniqueItem) => isEqual(item, uniqueItem))
    })
}

export function timeUntil(time: string): number {
    return differenceInSeconds(parseISO(time), new Date())
}

export function transformDepartureToLineData(
    departure: Departure,
): LineData | null {
    const {
        date,
        expectedDepartureTime,
        aimedDepartureTime,
        destinationDisplay,
        serviceJourney,
        situations,
        cancellation,
    } = departure

    const { line } = serviceJourney.journeyPattern || {}

    if (!line) return null

    const departureTime = parseISO(expectedDepartureTime)
    const minDiff = differenceInMinutes(departureTime, new Date())

    const route = `${line.publicCode || ''} ${
        destinationDisplay.frontText
    }`.trim()

    const quay = departure.quay

    const transportMode: TransportMode =
        line.transportMode === 'coach' ? TransportMode.BUS : line.transportMode
    const subType = departure.serviceJourney?.transportSubmode

    return {
        id: `${date}::${aimedDepartureTime}::${departure.serviceJourney.id}`,
        expectedDepartureTime,
        type: transportMode,
        subType,
        time: formatDeparture(minDiff, departureTime),
        route,
        situation: situations[0]?.summary?.[0]?.value,
        hasCancellation: cancellation,
        quay,
    }
}

export function createTileSubLabel({
    situation,
    hasCancellation,
    time,
}: LineData): TileSubLabel {
    return {
        situation,
        hasSituation: Boolean(situation),
        hasCancellation,
        time,
    }
}

export function toggleValueInList<T>(list: T[], item: T): T[] {
    if (list.includes(item)) {
        return list.filter((i) => i !== item)
    }
    return [...list, item]
}

// https://usehooks.com/useDebounce/
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return (): void => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

export function useCounter(interval = 1000): number {
    const [tick, setTick] = useState<number>(0)

    useEffect(() => {
        const timerID = setInterval(() => {
            setTick(tick + 1)
        }, interval)
        return (): void => clearInterval(timerID)
    }, [interval, tick])

    return tick
}

export function isLegMode(mode: string): mode is LegMode {
    return [
        'air',
        'bus',
        'water',
        'rail',
        'metro',
        'tram',
        'coach',
        'car',
        'bicycle',
        'foot',
    ].includes(mode)
}

export interface Suggestion {
    name: string
    id?: string
    coordinates?: {
        latitude: number
        longitude: number
    }
}

// Matches the ID in an URL, if it exists.
const ID_REGEX = /^\/(?:t|(?:admin))\/([a-zA-Z0-9_-]*)(?:\/)?/

export const getDocumentId = (): string | undefined => {
    const id = window.location.pathname.match(ID_REGEX)

    if (id) {
        return id[1]
    }
}

export function useFormFields<T>(
    initialState: T,
): [
    T,
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
] {
    const [values, setValues] = useState<T>(initialState)

    return [
        values,
        function (
            event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        ): void {
            setValues({
                ...values,
                [event.target.id]: event.target.value,
            })
        },
    ]
}

export function usePrevious<T>(value: T): T {
    const ref = useRef<T>(value)

    useEffect(() => {
        ref.current = value
    }, [value])

    return ref.current
}
export const isMobileWeb = (): boolean =>
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1

export const useThemeColor = (
    color: { [key: string]: string },
    fallback: string,
): string => {
    const [settings] = useSettingsContext()
    if (!settings?.theme) {
        return fallback
    }
    return color[settings?.theme] || fallback
}

export function isDarkOrDefaultTheme(theme?: Theme): boolean {
    return !theme || theme === Theme.DARK || theme === Theme.DEFAULT
}

export function isEqualUnsorted<T>(array: T[], includes: T[]): boolean {
    if (array.length !== includes.length) return false
    return includes.every((i) => array.includes(i))
}

export const getWeatherDescriptionFromApi = async (
    iconName: string,
    signal: AbortSignal,
): Promise<string> => {
    const weatherNameMatch = iconName.match(/.+?(?=_|$)/)
    if (!weatherNameMatch)
        return Promise.reject('No REGEX match found for ' + iconName)
    const url = `https://api.met.no/weatherapi/weathericon/2.0/legends`
    const response = await fetch(url, { signal })
    const weatherData = await response.json()
    return weatherData[weatherNameMatch.toString()].desc_nb
}

export const getWeatherIconEntur = (APIconName: string): JSX.Element => {
    const stripedAPIIconName = APIconName.replace(
        /heavy|light|showers|_|day|night/g,
        '',
    )
    const weatherConditions = stripedAPIIconName.split('and')

    const cloud = ['cloudy', 'fog']
    const sunCloud = ['fair', 'partlycloudy']
    const rain = ['rain']
    const lightning = ['thunder']
    const snow = ['snow', 'sleet']
    const sunCloudRain = ['rainshowers']
    const sun = ['clearsky']

    if (arrayContains(weatherConditions, lightning))
        return <CloudLightningIcon />
    if (arrayContains(weatherConditions, sunCloudRain))
        return <SunCloudRainIcon />
    if (arrayContains(weatherConditions, snow)) return <CloudSnowIcon />
    if (arrayContains(weatherConditions, rain)) return <CloudRainIcon />
    if (arrayContains(weatherConditions, sunCloud)) return <SunCloudIcon />
    if (arrayContains(weatherConditions, cloud)) return <CloudIcon />
    if (arrayContains(weatherConditions, sun))
        return <SunIcon className="icon-entur--sun" />
    return <div>?</div>
}

const arrayContains = (original: string[], contains: string[]): boolean =>
    original.some((r) => contains.indexOf(r) >= 0)

export function getDepartureNumber(departure: LineData): string {
    return departure.route.split(/[\s]/g)[0]
}

export function getDepartureDirection(departure: LineData): string[] {
    return departure.route.split(/([\s])/g).slice(1)
}

export function getTranslation(
    translationObject: TranslatedString,
    languageId = 'nb',
): string | null {
    const translations: Translation[] = translationObject.translation
    const match = translations.find(
        (currentTranslation) => currentTranslation.language === languageId,
    )
    if (!match) return null
    return match.value
}

export const getFeedbackString = (lastUpdated: number): string => {
    if (lastUpdated < 60) return `${lastUpdated} sekunder siden`
    if (lastUpdated < 120) return '> 1 minutt siden'
    return ` > ${Math.floor(lastUpdated / 60)} minutter siden`
}

export const getLastUpdated = (lastUpdated: string): number =>
    differenceInSeconds(new Date(), parseISO(lastUpdated))
