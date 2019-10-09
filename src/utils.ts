import moment, { Moment } from 'moment'
import { useState, useEffect, ElementType } from 'react'

import {
    BicycleIcon, BusIcon, FerryIcon, SubwayIcon,
    TrainIcon, TramIcon, PlaneIcon, COLORS,
} from '@entur/component-library'

import {
    Coordinates, TransportMode, BikeRentalStation, StopPlace, EstimatedCall, LegMode, TransportSubmode,
} from '@entur/sdk'

import { DEFAULT_DISTANCE } from './constants'
import service from './service'

import { Settings, LineData } from './types'

export function getIcon(type: LegMode): ElementType | null {
    switch (type) {
        case 'bus':
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

export function getIconColor(type: LegMode, subType: TransportSubmode): string {
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

export function onBlur(isChecked: boolean): { opacity: number } | null {
    return isChecked ? null : { opacity: 0.3 }
}

export function getPositionFromUrl(): Coordinates {
    const positionArray = window.location.pathname.split('/')[2].split('@')[1].split('-').join('.').split(/,/)
    return { latitude: Number(positionArray[0]), longitude: Number(positionArray[1]) }
}

export function getSettingsFromUrl(): Settings {
    const settings = window.location.pathname.split('/')[3]
    return (settings) ? JSON.parse(atob(settings)) : {
        hiddenStations: [], hiddenStops: [], hiddenRoutes: [], distance: DEFAULT_DISTANCE, hiddenModes: [], newStations: [], newStops: [],
    }
}

export function groupBy(objectArray: Array<any>, property: string): { [key: string]: Array<any> } {
    return objectArray.reduce((acc, obj) => {
        const key = obj[property]
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(obj)
        return acc
    }, {})
}

function getTransportModes(departures: Array<any>): Array<TransportMode> {
    return [...new Set(departures.map(item => item.type))]
}

export function getTransportModesByStop(stop) {
    const dep = stop.map(({ departures }) => getTransportModes(departures))
    return [...new Set([].concat(...dep))]
}

export function getTransportHeaderIcons(departures, hiddenModes) {
    const transportModes = getTransportModes(departures).filter(f => !hiddenModes.includes(f))

    return transportModes.map((mode) => (
        getIcon(mode)
    ))
}

function onFilterDepartures(groupedDepartures: { [key: string]: Array<any> }, hiddenModes: Array<string>) {
    const unHiddenDepartures = Object.values(groupedDepartures).map((departures) => {
        const filteredDepartures = departures.filter(({ type }) => !hiddenModes.includes(type))
        if (filteredDepartures.length > 0) {
            return filteredDepartures
        }
    }).filter(Boolean)
    return unHiddenDepartures.length > 0
}

export function isVisible(groupedDepartures, hiddenRoutes, hiddenModes) {
    if (!onFilterDepartures(groupedDepartures, hiddenModes)) {
        return false
    }
    const tileKeys = Object.keys(groupedDepartures)
    const visibleRoutes = tileKeys.filter((route) => !hiddenRoutes.includes(route))
    return visibleRoutes.length > 0
}

export function formatDeparture(minDiff: number, departureTime: Moment) {
    if (minDiff > 15) return departureTime.format('HH:mm')
    return minDiff < 1 ? 'nå' : minDiff.toString() + ' min'
}

export function getUniqueRoutes(lines: Array<LineData>): Array<LineData> {
    const uniqueThings = {}
    lines.forEach((line) => {
        uniqueThings[line.route] = line
    })
    return Object.values(uniqueThings)
}

export function transformDepartureToLineData(departure: EstimatedCall): LineData {
    const { expectedDepartureTime, destinationDisplay, serviceJourney } = departure
    const { line } = serviceJourney.journeyPattern
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

export function getStopsWithUniqueStopPlaceDepartures(stops: Array<StopPlace>) {
    return service.getStopPlaceDepartures(stops.map(({ id }) => id), { includeNonBoarding: true, departures: 50 }).then(departures => {
        return stops.map(stop => {
            const resultForThisStop = departures.find(({ id }) => stop.id === id)
            if (!resultForThisStop || !resultForThisStop.departures) {
                return stop
            }

            return {
                ...stop,
                departures: getUniqueRoutes(resultForThisStop.departures.map(transformDepartureToLineData)),
            }
        })
    })
}

function updateHiddenList(clickedId: string, hiddenList: Array<string>): Array<string> {
    let newSet = hiddenList
    if (hiddenList.includes(clickedId)) {
        newSet = newSet.filter((id) => id !== clickedId)
    }
    else {
        newSet.push(clickedId)
    }
    return newSet
}

export function getSettingsHash(distance, hiddenStations, hiddenStops, hiddenRoutes, hiddenModes, newStations, newStops) {
    const savedSettings = {
        distance,
        hiddenStations,
        hiddenStops,
        hiddenRoutes,
        hiddenModes,
        newStations,
        newStops,
    }
    return btoa(JSON.stringify(savedSettings))
}

export function sortLists(list1, list2) {
    const combinedList = list1.concat(list2)
    return combinedList.sort((a, b) => {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
    })
}

export function updateSettingsHashStops(state, sortedStops) {
    const {
        distance, hiddenStations, hiddenStops, hiddenRoutes, hiddenModes, newStations,
    } = state
    const savedSettings = {
        distance,
        hiddenStations,
        hiddenStops,
        hiddenRoutes,
        hiddenModes,
        newStations,
        newStops: sortedStops,
    }
    return btoa(JSON.stringify(savedSettings))
}

export function updateSettingsHashStations(state: Settings, sortedStations: Array<BikeRentalStation>) {
    const {
        distance, hiddenStations, hiddenStops, hiddenRoutes, hiddenModes, newStops,
    } = state
    const savedSettings = {
        distance,
        hiddenStations,
        hiddenStops,
        hiddenRoutes,
        hiddenModes,
        newStations: sortedStations,
        newStops,
    }
    return btoa(JSON.stringify(savedSettings))
}

export function updateHiddenListAndHash(clickedId: string, state: Settings, hiddenType: 'stations' | 'stops' | 'routes' | 'transportModes') {
    const {
        hiddenStops, hiddenStations, distance, hiddenRoutes, hiddenModes,
        newStations, newStops,
    } = state
    let newSet = []
    let hashedState = ''
    let hiddenLists = {
        hiddenStations,
        hiddenStops,
        hiddenRoutes,
        hiddenModes,
    }
    switch (hiddenType) {
        case 'stations':
            newSet = updateHiddenList(clickedId, hiddenStations)
            hashedState = getSettingsHash(distance, newSet, hiddenStops, hiddenRoutes, hiddenModes, newStations, newStops)
            hiddenLists = {
                hiddenStations: newSet,
                hiddenStops,
                hiddenRoutes,
                hiddenModes,
            }
            return { hiddenLists, hashedState }
        case 'stops':
            newSet = updateHiddenList(clickedId, hiddenStops)
            hashedState = getSettingsHash(distance, hiddenStations, newSet, hiddenRoutes, hiddenModes, newStations, newStops)
            hiddenLists = {
                hiddenStations,
                hiddenStops: newSet,
                hiddenRoutes,
                hiddenModes,
            }
            return { hiddenLists, hashedState }
        case 'routes':
            newSet = updateHiddenList(clickedId, hiddenRoutes)
            hashedState = getSettingsHash(distance, hiddenStations, hiddenStops, newSet, hiddenModes, newStations, newStops)
            hiddenLists = {
                hiddenStations,
                hiddenStops,
                hiddenRoutes: newSet,
                hiddenModes,
            }
            return { hiddenLists, hashedState }
        case 'transportModes':
            newSet = updateHiddenList(clickedId, hiddenModes)
            hashedState = getSettingsHash(distance, hiddenStations, hiddenStops, hiddenRoutes, newSet, newStations, newStops)
            hiddenLists = {
                hiddenStations,
                hiddenStops,
                hiddenRoutes,
                hiddenModes: newSet,
            }
            return { hiddenLists, hashedState }

        default:
            return { hiddenLists, hashedState }
    }
}

export function getCombinedStopPlaceAndRouteId(stopPlaceId: string, routeName: string): string {
    return `${stopPlaceId}$${routeName}`
}

export function checkIsHidden(id: string, type: string, hidden: Settings): boolean {
    const {
        hiddenStops, hiddenStations, hiddenRoutes, hiddenModes,
    } = hidden
    if (type === 'stations') {
        return hiddenStations.includes(id)
    }
    if (type === 'stops') {
        return hiddenStops.includes(id)
    }

    if (type === 'modes') {
        // @ts-ignore
        return hiddenModes.includes(id)
    }
    return hiddenRoutes.includes(id)
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
