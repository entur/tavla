import React, { useState, useEffect } from 'react'

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
    CarFerryIcon,
} from '@entur/icons'

import { colors } from '@entur/tokens'

import { Departure, LegMode, TransportSubmode } from '@entur/sdk'

import { LineData, TileSubLabel } from './types'

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

export function getIconColor(
    type: LegMode,
    subType?: TransportSubmode,
): string {
    if (isSubModeAirportLink(subType)) return colors.transport.contrast.plane

    switch (type) {
        case 'bus':
            return colors.transport.contrast.bus
        case 'bicycle':
            return colors.transport.contrast.mobility
        case 'water':
            return colors.transport.contrast.ferry
        case 'metro':
            return colors.transport.contrast.metro
        case 'rail':
            return colors.transport.contrast.train
        case 'tram':
            return colors.transport.contrast.tram
        case 'air':
            return colors.transport.contrast.plane
        default:
            return colors.transport.contrast.walk
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
    legMode: LegMode,
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
    legMode: LegMode,
    subMode?: TransportSubmode,
    color?: string,
): JSX.Element | null {
    const colorToUse = color ?? getIconColor(legMode, subMode)

    const identifier = getTransportIconIdentifier(legMode, subMode)

    switch (identifier) {
        case 'bus':
            return <BusIcon color={colorToUse} />
        case 'bicycle':
            return <BicycleIcon color={colorToUse} />
        case 'carferry':
            return <CarFerryIcon color={colorToUse} />
        case 'ferry':
            return <FerryIcon color={colorToUse} />
        case 'subway':
            return <SubwayIcon color={colorToUse} />
        case 'train':
            return <TrainIcon color={colorToUse} />
        case 'tram':
            return <TramIcon color={colorToUse} />
        case 'plane':
            return <PlaneIcon color={colorToUse} />
        default:
            return null
    }
}

export function groupBy<T extends { [key: string]: any }>(
    objectArray: T[],
    property: keyof T,
): { [key: string]: Array<T> } {
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
    array: Array<T>,
    isEqual: (a: T, b: T) => boolean = (a, b): boolean => a === b,
): Array<T> {
    return array.filter((item, index, items) => {
        const previousItems = items.slice(0, index)
        return !previousItems.some(uniqueItem => isEqual(item, uniqueItem))
    })
}

export function timeUntil(time: string): number {
    return differenceInSeconds(parseISO(time), new Date())
}

export function transformDepartureToLineData(departure: Departure): LineData {
    const {
        date,
        expectedDepartureTime,
        destinationDisplay,
        serviceJourney,
        situations,
        cancellation,
    } = departure

    const { line } = serviceJourney.journeyPattern

    const departureTime = parseISO(expectedDepartureTime)
    const minDiff = differenceInMinutes(departureTime, new Date())

    const route = `${line.publicCode || ''} ${
        destinationDisplay.frontText
    }`.trim()

    const transportMode =
        line.transportMode === 'coach' ? 'bus' : line.transportMode
    const subType = departure.serviceJourney.transportSubmode

    return {
        id: `${date}::${departure.serviceJourney.id}`,
        expectedDepartureTime,
        type: transportMode,
        subType,
        time: formatDeparture(minDiff, departureTime),
        route,
        situation: situations[0]?.summary?.[0]?.value,
        hasCancellation: cancellation,
    }
}

export function createTileSubLabel({
    situation,
    hasCancellation,
    time,
}: LineData): TileSubLabel {
    return {
        hasSituation: Boolean(situation),
        hasCancellation,
        time,
    }
}

export function toggleValueInList<T>(list: Array<T>, item: T): Array<T> {
    if (list.includes(item)) {
        return list.filter(i => i !== item)
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
const ID_REGEX = /\/(?:t|(?:admin))\/(\w+)(?:\/)?/

export const getDocumentId = (): string | undefined => {
    const id = window.location.pathname.match(ID_REGEX)

    if (id) {
        return id[1]
    }
}
