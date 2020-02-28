import { useState, useEffect, ElementType } from 'react'

import differenceInSeconds from 'date-fns/differenceInSeconds'
import differenceInMinutes from 'date-fns/differenceInMinutes'
import format from 'date-fns/format'

import {
    BicycleIcon,
    BusIcon,
    FerryIcon,
    SubwayIcon,
    TrainIcon,
    TramIcon,
    PlaneIcon,
    CarFerryIcon,
} from '@entur/component-library'

import { colors } from '@entur/tokens'

import {
    Coordinates,
    Departure,
    LegMode,
    TransportSubmode,
    Feature,
} from '@entur/sdk'

import { LineData } from './types'

function isSubModeAirportLink(subMode?: string): boolean {
    const airportLinkTypes = ['airportLinkRail', 'airportLinkBus']
    return airportLinkTypes.includes(subMode)
}

function isSubModeCarFerry(subMode?: string): boolean {
    const carFerryTypes = [
        'localCarFerry',
        'internationalCarFerry',
        'nationalCarFerry',
        'regionalCarFerry',
    ]

    return carFerryTypes.includes(subMode)
}

export function getIcon(type: LegMode, subMode?: string): ElementType | null {
    if (isSubModeCarFerry(subMode)) {
        return CarFerryIcon
    }

    switch (type) {
        case 'bus':
        case 'coach':
            return BusIcon
        case 'bicycle':
            return BicycleIcon
        case 'water':
            return FerryIcon
        case 'metro':
            return SubwayIcon
        case 'rail':
            return TrainIcon
        case 'tram':
            return TramIcon
        case 'air':
            return PlaneIcon
        default:
            return null
    }
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
            return null
    }
}

export function getPositionFromUrl(): Coordinates {
    const positionArray = window.location.pathname
        .split('/')[2]
        .split('@')[1]
        .split('-')
        .join('.')
        .split(/,/)
    return {
        latitude: Number(positionArray[0]),
        longitude: Number(positionArray[1]),
    }
}

export function groupBy<T>(
    objectArray: Array<T>,
    property: string,
): { [key: string]: Array<T> } {
    return objectArray.reduce((acc, obj) => {
        const key = obj[property]
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(obj)
        return acc
    }, {})
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
    return differenceInSeconds(new Date(time), new Date())
}

export function transformDepartureToLineData(departure: Departure): LineData {
    const {
        date,
        expectedDepartureTime,
        destinationDisplay,
        serviceJourney,
    } = departure

    const { line } = serviceJourney
    const departureTime = new Date(expectedDepartureTime)
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

export function mapFeaturesToSuggestions(
    features: Array<Feature>,
): Array<Suggestion> {
    return features.map(({ geometry, properties: { id, name, locality } }) => {
        return {
            coordinates: {
                longitude: geometry.coordinates[0],
                latitude: geometry.coordinates[1],
            },
            id,
            name: locality ? `${name}, ${locality}` : name,
        }
    })
}
