import React from 'react'
import EnturService from '@entur/sdk'
import moment from 'moment'
import {
    Bus, CityBike, Ferry, Lock, Metro, Train, Tram,
} from './assets/icons'

import { MAX_DISTANCE_MINUTES, WALK_SPEED, DEFAULT_DISTANCE } from './constants'

const service = new EnturService({ clientName: 'entur-tavla' })

export function getIcon(type, props) {
    switch (type) {
        case 'bus':
            return <Bus {...props} />
        case 'bike':
            return <CityBike {...props} />
        case 'water':
            return <Ferry {...props} />
        case 'metro':
            return <Metro {...props} />
        case 'rail':
            return <Train {...props} />
        case 'tram':
            return <Tram {...props} />
        case 'lock':
            return <Lock {...props} />
        default:
            return null
    }
}

export function onBlur(isChecked) {
    return isChecked ? null : { opacity: 0.3 }
}

export function getPositionFromUrl() {
    const positionArray = window.location.pathname.split('/')[2].split('@')[1].split('-').join('.').split(/,/)
    return { latitude: positionArray[0], longitude: positionArray[1] }
}

export function getSettingsFromUrl() {
    const settings = window.location.pathname.split('/')[3]
    return (settings !== '') ? JSON.parse(atob(settings)) : {
        hiddenStations: [], hiddenStops: [], hiddenRoutes: [], distance: DEFAULT_DISTANCE, hiddenModes: [],
    }
}

export function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
        const key = obj[property]
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(obj)
        return acc
    }, {})
}

function getTransportModes(departures) {
    return [...new Set(departures.map(item => item.type))]
}

export function getTransportModesByStop(stop) {
    const dep = stop.map(({ departures }) => getTransportModes(departures))
    return [...new Set([].concat(...dep))]
}

export function getTransportHeaderIcon(departures, dimensions, hiddenModes) {
    const transportModes = getTransportModes(departures).filter(f => !hiddenModes.includes(f))
    if (!dimensions) {
        return transportModes.map((mode, index) => (
            getIcon(mode, { height, width, key: index })
        ))
    }
    const { height, width } = dimensions
    const length = transportModes.length
    return transportModes.map((mode, index) => (
        getIcon(mode, { height: 90/length, width: 90/length, key: index })
    ))
}

function onFilterDepartures(groupedDepartures, hiddenModes) {
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

export function formatDeparture(minDiff, departureTime) {
    if (minDiff > 15) return departureTime.format('HH:mm')
    return minDiff < 1 ? 'nå' : minDiff.toString() + ' min'
}

function getUniqueRoutes(routes) {
    const uniqueThings = {}
    routes.forEach(({ route, type }) => {
        uniqueThings[route] = type
    })
    return Object.entries(uniqueThings).map(([route, type]) => ({ route, type }))
}

function transformDepartureToLineData(departure) {
    const { expectedDepartureTime, destinationDisplay, serviceJourney } = departure
    const { line } = serviceJourney.journeyPattern
    const departureTime = moment(expectedDepartureTime)
    const minDiff = departureTime.diff(moment(), 'minutes')

    return {
        type: line.transportMode,
        time: formatDeparture(minDiff, departureTime),
        route: line.publicCode + ' '+ destinationDisplay.frontText,
    }
}

export function getStopsWithUniqueStopPlaceDepartures(stops) {
    return service.getStopPlaceDepartures(stops.map(({ id }) => id), { onForBoarding: true, departures: 50 }).then(departures => {
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

export function getStopPlacesByPositionAndDistance(position, distance) {
    return service.getStopPlacesByPosition(position, distance).then(stopPlaces => {
        return stopPlaces.map(stop => {
            return {
                ...stop,
                departures: [],
            }
        })
    })
}

function updateHiddenList(clickedId, hiddenList) {
    let newSet = hiddenList
    if (hiddenList.includes(clickedId)) {
        newSet = newSet.filter((id) => id !== clickedId)
    }
    else {
        newSet.push(clickedId)
    }
    console.log(newSet)
    return newSet
}

export function getSettingsHash(distance, hiddenStations, hiddenStops, hiddenRoutes, hiddenModes) {
    const savedSettings = {
        distance,
        hiddenStations,
        hiddenStops,
        hiddenRoutes,
        hiddenModes,
    }
    return btoa(JSON.stringify(savedSettings))
}

export function updateHiddenListAndHash(clickedId, state, hiddenType) {
    const {
        hiddenStops, hiddenStations, distance, hiddenRoutes, hiddenModes,
    } = state
    let newSet = []
    let hashedState = ''
    let hiddenLists = {}
    switch (hiddenType) {
        case 'stations':
            newSet = updateHiddenList(clickedId, hiddenStations)
            hashedState = getSettingsHash(distance, newSet, hiddenStops, hiddenRoutes, hiddenModes)
            hiddenLists = {
                hiddenStations: newSet,
                hiddenStops,
                hiddenRoutes,
                hiddenModes,
            }
            return { hiddenLists, hashedState }
        case 'stops':
            newSet = updateHiddenList(clickedId, hiddenStops)
            hashedState = getSettingsHash(distance, hiddenStations, newSet, hiddenRoutes, hiddenModes)
            hiddenLists = {
                hiddenStations,
                hiddenStops: newSet,
                hiddenRoutes,
                hiddenModes,
            }
            return { hiddenLists, hashedState }
        case 'routes':
            newSet = updateHiddenList(clickedId, hiddenRoutes)
            hashedState = getSettingsHash(distance, hiddenStations, hiddenStops, newSet, hiddenModes)
            hiddenLists = {
                hiddenStations,
                hiddenStops,
                hiddenRoutes: newSet,
                hiddenModes,
            }
            return { hiddenLists, hashedState }
        case 'transportModes':
            newSet = updateHiddenList(clickedId, hiddenModes)
            hashedState = getSettingsHash(distance, hiddenStations, hiddenStops, hiddenRoutes, newSet)
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

export function distanceToMinutes(distance) {
    return Math.round((distance)/(WALK_SPEED*60))
}

export function minutesToDistance(minutes) {
    if (minutes > MAX_DISTANCE_MINUTES) {
        return (MAX_DISTANCE_MINUTES*60)*WALK_SPEED
    }
    return (minutes*60)*WALK_SPEED
}
