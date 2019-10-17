import moment, { Moment } from 'moment'
import { useState, useEffect, ElementType } from 'react'

import {
    BicycleIcon, BusIcon, FerryIcon, SubwayIcon,
    TrainIcon, TramIcon, PlaneIcon, COLORS,
} from '@entur/component-library'

import {
    Coordinates, Departure, LegMode, TransportSubmode,
} from '@entur/sdk'

import { LineData } from './types'

export function getIcon(type: LegMode): ElementType | null {
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

export function getIconColor(type: LegMode, subType?: TransportSubmode): string {
    const airportLinkTypes = ['airportLinkRail', 'airportLinkBus']
    if (airportLinkTypes.includes(subType)) return COLORS.PLANE_MIDNIGHT

    switch (type) {
        case 'bus':
            return COLORS.BUS_MIDNIGHT
        case 'bicycle':
            return COLORS.BICYCLE_MIDNIGHT
        case 'water':
            return COLORS.FERRY_MIDNIGHT
        case 'metro':
            return COLORS.METRO_MIDNIGHT
        case 'rail':
            return COLORS.TRAIN_MIDNIGHT
        case 'tram':
            return COLORS.TRAM_MIDNIGHT
        case 'air':
            return COLORS.PLANE_MIDNIGHT
        default:
            return null
    }
}

export function getPositionFromUrl(): Coordinates {
    const positionArray = window.location.pathname.split('/')[2].split('@')[1].split('-').join('.').split(/,/)
    return { latitude: Number(positionArray[0]), longitude: Number(positionArray[1]) }
}

export function groupBy<T>(objectArray: Array<T>, property: string): { [key: string]: Array<T> } {
    return objectArray.reduce((acc, obj) => {
        const key = obj[property]
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(obj)
        return acc
    }, {})
}

function formatDeparture(minDiff: number, departureTime: Moment): string {
    if (minDiff > 15) return departureTime.format('HH:mm')
    return minDiff < 1 ? 'nå' : minDiff.toString() + ' min'
}

export function unique<T>(array: Array<T>, isEqual: (a: T, b: T) => boolean = (a, b): boolean => a === b): Array<T> {
    return array.filter((item, index, items) => {
        const previousItems = items.slice(0, index)
        return !previousItems.some(uniqueItem => isEqual(item, uniqueItem))
    })
}

export function transformDepartureToLineData(departure: Departure): LineData {
    const { expectedDepartureTime, destinationDisplay, serviceJourney } = departure
    const { line } = serviceJourney
    const departureTime = moment(expectedDepartureTime)
    const minDiff = departureTime.diff(moment(), 'minutes')

    const route = `${line.publicCode || ''} ${destinationDisplay.frontText}`.trim()

    const transportMode = line.transportMode === 'coach' ? 'bus' : line.transportMode
    const subType = departure.serviceJourney.transportSubmode

    return {
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

    useEffect(
        () => {
            const handler = setTimeout(() => {
                setDebouncedValue(value)
            }, delay)

            return (): void => {
                clearTimeout(handler)
            }
        },
        [value, delay]
    )

    return debouncedValue
}

export function isLegMode(mode: string): mode is LegMode {
    return ['air', 'bus', 'water', 'rail', 'metro', 'tram', 'coach', 'car', 'bicycle', 'foot'].includes(mode)
}
