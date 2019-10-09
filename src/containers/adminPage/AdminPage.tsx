import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@entur/component-library'
import { Coordinates, StopPlace } from '@entur/sdk'

import SelectionPanel from './SelectionPanel'
import BikePanel from './BikePanel'
import FilterPanel from './filterPanel/FilterPanel'

import {
    getPositionFromUrl,
    getSettingsFromUrl,
    getStopsWithUniqueStopPlaceDepartures,
    getSettingsHash,
    getUniqueRoutes,
    transformDepartureToLineData,
    updateHiddenListAndHash,
    getTransportModesByStop,
    sortLists,
    checkIsHidden,
    useDebounce,
} from '../../utils'

import { DEFAULT_DISTANCE } from '../../constants'
import service from '../../service'
import { StopPlaceWithDepartures } from '../../types'

import AdminHeader from './AdminHeader'

import './styles.scss'

function getStyle(isHidden: boolean) {
    return isHidden ? null : { opacity: 0.3 }
}

function getStopsDataWithDepartures(stopIds: Array<string>): Promise<Array<StopPlaceWithDepartures>> {
    return Promise.all(stopIds.map(async stopId => {
        const [stop, departures] = await Promise.all([
            service.getStopPlace(stopId),
            service.getStopPlaceDepartures(stopId, {
                includeNonBoarding: true,
                departures: 50,
            }),
        ])
        return {
            ...stop,
            departures: getUniqueRoutes(departures.map(transformDepartureToLineData)),
        }
    }))
}

async function getData(position: Coordinates | void, newDistance: number) {
    if (!position) {
        return
    }

    const { newStations, newStops } = getSettingsFromUrl()

    const hashedStationsData = await Promise.all(newStations.map(stationId => service.getBikeRentalStation(stationId)))
    const stations = await service.getBikeRentalStations(position, newDistance)
    const allStations = sortLists(hashedStationsData, stations)

    const stops = await service.getStopPlacesByPosition(position, newDistance)
    const hashedStopsData = await getStopsDataWithDepartures(newStops)

    const allStops: Array<StopPlace> = sortLists(hashedStopsData, stops)

    const uniqueRoutes = await getStopsWithUniqueStopPlaceDepartures(allStops)
    const uniqueModes = getTransportModesByStop(uniqueRoutes)

    let newTransportModes = uniqueModes
    if (allStations.length > 0) {
        newTransportModes = uniqueModes.includes('bicycle')
            ? uniqueModes
            : ['bicycle', ...uniqueModes]
    }

    return {
        stops: uniqueRoutes,
        transportModes: newTransportModes,
        stations: allStations,
    }
}

const AdminPage = ({ history }) => {
    const [distance, setDistance] = useState<number>(DEFAULT_DISTANCE)
    const debouncedDistance = useDebounce(distance, 300)

    const [position, setPosition] = useState<Coordinates | null>(null)
    const debouncedPosition = useDebounce(position, 300)

    const [positionString, setPositionString] = useState(null)

    const [stationsData, setStationsData] = useState({
        stations: [],
        newStations: [],
    })

    const [stopsData, setStopsData] = useState({
        stops: [],
        newStops: [],
    })

    const [hidden, setHidden] = useState({
        hiddenStations: [],
        hiddenStops: [],
        hiddenRoutes: [],
        hiddenModes: [],
    })

    const [hashedState, setHashedState] = useState(null)
    const [transportModes, setTransportModes] = useState([])

    useEffect(() => {
        getData(debouncedPosition, debouncedDistance).then(data => {
            if (!data) return
            const {
                transportModes: transModes,
                stops,
                stations,
            } = data
            setTransportModes(transModes)

            setStopsData(prevStopsData => ({
                ...prevStopsData,
                stops: stops.map((stop: any) => ({
                    ...stop,
                    departures: (stop.departures || []).filter(({ type }) => !hidden.hiddenModes.includes(type)),
                })).filter(stop => stop.departures.length),
            }))

            const bikeRentalStations = hidden.hiddenModes.includes('bicycle') ? [] : stations
            setStationsData(prevStationsData => ({ ...prevStationsData, stations: bikeRentalStations }))
        })
    }, [debouncedPosition, debouncedDistance, hidden.hiddenModes])

    useEffect(() => {
        const {
            hiddenStations,
            hiddenStops,
            distance: newDistance,
            hiddenRoutes,
            hiddenModes,
            newStations,
            newStops,
        } = getSettingsFromUrl()

        const newHashedState = window.location.pathname.split('/')[3]

        setStationsData(v => ({
            ...v,
            newStations,
        }))

        setStopsData(v => ({
            ...v,
            newStops,
        }))

        setDistance(newDistance)
        setHashedState(newHashedState)

        setHidden({
            hiddenStops,
            hiddenStations,
            hiddenRoutes,
            hiddenModes,
        })

        setPosition(getPositionFromUrl())
        setPositionString(window.location.pathname.split('/')[2])
    }, [])

    const updateAndGoToDashboard = () => {
        const {
            hiddenStations, hiddenStops, hiddenRoutes, hiddenModes,
        } = hidden
        const { newStations, newStops } = getSettingsFromUrl()

        const newHashedState = getSettingsHash(
            distance,
            hiddenStations,
            hiddenStops,
            hiddenRoutes,
            hiddenModes,
            newStations,
            newStops,
        )

        setHashedState(newHashedState)

        history.push(`/dashboard/${positionString}/${newHashedState}`)
    }

    const goBackToDashboard = useCallback(() => {
        history.push(window.location.pathname.replace('admin', 'dashboard'))
    }, [history])

    const updateHiddenList = useCallback((clickedId, hiddenListType) => {
        const { hiddenLists, hashedState: newHashedState } = updateHiddenListAndHash(
            clickedId,
            {
                ...hidden,
                ...stationsData,
                ...stopsData,
                distance,
            },
            hiddenListType,
        )

        setHidden(hiddenLists)
        setHashedState(newHashedState)

        history.push(`/admin/${positionString}/${hashedState}`)
    }, [distance, hashedState, hidden, history, positionString, stationsData, stopsData])

    const updateHiddenListForAll = (checked: boolean, type: 'stops' | 'stations') => {
        switch (type) {
            case 'stops':
                const stopIds = stopsData.stops.map(stop => stop.id)
                const hiddenStops = !checked ? stopIds : []

                setHidden(v => ({
                    ...v,
                    hiddenStops,
                }))

                break
            case 'stations':
                const stationIds = stationsData.stations.map(station => station.id)
                const hiddenStations = !checked ? stationIds : []

                setHidden(v => ({
                    ...v,
                    hiddenStations,
                }))

                break
        }
    }

    const isHidden = useCallback((id, type) => checkIsHidden(id, type, hidden), [hidden])

    const handleDistanceChange = useCallback(event => {
        const newDistance = event.target.value
        setDistance(newDistance)
    }, [])

    const handleAddNewStation = useCallback(stations => {
        const stationIds = stations
            .filter(station => stationsData.stations.every(item => item.name !== station.name))
            .map(station => station.id)

        if (!stationIds.length) return

        const { newStations } = getSettingsFromUrl()

        const updatedNewStations = sortLists(newStations, stationIds)
        const updatedStations = sortLists(stationsData.stations, stations)

        const {
            hiddenStations, hiddenStops, hiddenRoutes, hiddenModes,
        } = hidden

        const newHashedState = getSettingsHash(
            distance,
            hiddenStations,
            hiddenStops,
            hiddenRoutes,
            hiddenModes,
            updatedNewStations,
            stopsData.newStops,
        )

        setHashedState(newHashedState)
        setStationsData({
            stations: updatedStations,
            newStations: updatedNewStations,
        })

        history.push(`/admin/${positionString}/${newHashedState}`)
    }, [distance, hidden, history, positionString, stationsData.stations, stopsData.newStops])

    const handleAddNewStop = useCallback((newStop) => {
        const found = stopsData.stops.some(item => item.id === newStop.id)
        const hasDepartures = !(newStop.departures.length === 0)

        if (found || !hasDepartures) return

        getStopsWithUniqueStopPlaceDepartures([newStop]).then(stop => {
            const {
                hiddenStations, hiddenStops, hiddenRoutes, hiddenModes,
            } = hidden

            const { newStops } = getSettingsFromUrl()

            const updatedNewStops = sortLists(newStops, [newStop.id])
            const newHashedState = getSettingsHash(
                distance,
                hiddenStations,
                hiddenStops,
                hiddenRoutes,
                hiddenModes,
                stationsData.newStations,
                updatedNewStops,
            )

            const updatedStops = sortLists(stopsData.stops, stop)

            setStopsData({
                stops: updatedStops,
                newStops: updatedNewStops,
            })
            setHashedState(newHashedState)

            history.push(`/admin/${positionString}/${hashedState}`)
        })
    }, [distance, hashedState, hidden, history, positionString, stationsData.newStations, stopsData.stops])

    const { stations } = stationsData
    const { stops } = stopsData
    const { hiddenModes } = hidden

    return (
        <div className="admin-container main-container">
            <AdminHeader goBackToDashboard={goBackToDashboard} />
            <div className="admin-content">
                <FilterPanel
                    isHidden={isHidden}
                    transportModes={transportModes}
                    distance={distance}
                    handleSliderChange={handleDistanceChange}
                    handleTextInputChange={handleDistanceChange}
                    updateHiddenList={updateHiddenList}
                    getStyle={getStyle}
                    hiddenModes={hiddenModes}
                />
                <SelectionPanel
                    stops={stops}
                    updateHiddenList={updateHiddenList}
                    updateHiddenListForAll={updateHiddenListForAll}
                    onCheck={isHidden}
                    handleAddNewStop={handleAddNewStop}
                />
                {
                    !hiddenModes.includes('bicycle') ? (
                        <BikePanel
                            stations={stations}
                            updateHiddenList={updateHiddenList}
                            updateHiddenListForAll={updateHiddenListForAll}
                            onCheck={isHidden}
                            position={position}
                            handleAddNewStation={handleAddNewStation}
                        />
                    ) : null
                }
            </div>
            <div className="update-button-container">
                <Button variant="secondary" onClick={updateAndGoToDashboard}>
                    Oppdater tavle
                </Button>
            </div>
        </div>
    )
}

export default AdminPage
