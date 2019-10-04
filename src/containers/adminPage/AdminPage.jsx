import React, { useState, useEffect } from 'react'
import debounce from 'lodash.debounce'
import { Button } from '@entur/component-library'

import SelectionPanel from './SelectionPanel'
import BikePanel from './BikePanel'
import FilterPanel from './filterPanel/FilterPanel'
import {
    getPositionFromUrl,
    getSettingsFromUrl,
    getStopsWithUniqueStopPlaceDepartures,
    getStopPlacesByPositionAndDistance,
    getSettingsHash,
    getUniqueRoutes,
    transformDepartureToLineData,
    updateHiddenListAndHash,
    getTransportModesByStop,
    sortLists,
} from '../../utils'
import { DEFAULT_DISTANCE } from '../../constants'
import service from '../../service'
import AdminHeader from './AdminHeader'

import './styles.scss'

const AdminPage = ({ history }) => {
    const [distance, setDistance] = useState(DEFAULT_DISTANCE)

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

    const [positionData, setPositionData] = useState({
        position: {},
        positionString: null,
    })

    const [hashedState, setHashedState] = useState(null)
    const [transportModes, setTransportModes] = useState([])

    const getDataFromSDK = (position, newDistance) => {
        const { newStations } = getSettingsFromUrl()

        Promise.all(newStations.map(stationId => service.getBikeRentalStation(stationId))).then(
            hashedStationsData => {
                service.getBikeRentalStations(position, newDistance).then(stations => {
                    const allStations = sortLists(hashedStationsData, stations)

                    let newTransportModes = []
                    if (allStations.length > 0) {
                        newTransportModes = transportModes.includes('bike')
                            ? transportModes
                            : ['bike', ...transportModes]
                    } else {
                        newTransportModes = transportModes
                    }
                    if (hidden.hiddenModes.includes('bike')) {
                        setStationsData(v => ({
                            ...v,
                            stations: [],
                        }))
                    } else {
                        setStationsData(v => ({
                            ...v,
                            stations: allStations,
                        }))
                    }

                    setTransportModes(newTransportModes)
                })
            },
        )

        getStopPlacesByPositionAndDistance(position, distance).then(stops => {
            const { newStops } = getSettingsFromUrl()
            const hashedStops = newStops.map(stopId => {
                return service.getStopPlace(stopId).then(stop => {
                    return service
                        .getStopPlaceDepartures(stopId, {
                            includeNonBoarding: true,
                            departures: 50,
                        })
                        .then(departures => {
                            return {
                                ...stop,
                                departures: getUniqueRoutes(
                                    departures.map(transformDepartureToLineData),
                                ),
                            }
                        })
                })
            })

            Promise.all(hashedStops).then(hashedStopsData => {
                const allStops = sortLists(hashedStopsData, stops)

                getStopsWithUniqueStopPlaceDepartures(allStops).then(uniqueRoutes => {
                    const uniqueModes = getTransportModesByStop(uniqueRoutes)
                    const filterStops = uniqueRoutes
                        .map(stop => {
                            const filterStop = stop.departures.filter(
                                ({ type }) => !hidden.hiddenModes.includes(type),
                            )
                            if (filterStop.length > 0) {
                                return {
                                    ...stop,
                                    departures: filterStop,
                                }
                            }
                        })
                        .filter(Boolean)

                    setStopsData(v => ({
                        ...v,
                        stops: filterStops,
                    }))

                    setTransportModes([...new Set([...transportModes, ...uniqueModes])])
                })
            })
        })
    }

    useEffect(() => {
        const position = getPositionFromUrl()
        const positionString = window.location.pathname.split('/')[2]
        const {
            hiddenStations,
            hiddenStops,
            distance: newDistance,
            hiddenRoutes,
            hiddenModes,
            newStations,
            newStops,
        } = getSettingsFromUrl()

        getDataFromSDK(position, newDistance)

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

        setPositionData({
            position,
            positionString,
        })
    }, [
        getPositionFromUrl,
        getSettingsFromUrl,
        setStationsData,
        setStopsData,
        setDistance,
        setHashedState,
        setHidden,
        setPositionData,
        getDataFromSDK,
    ])

    const updateSearch = debounce((newDistance, position) => {
        getDataFromSDK(position, newDistance)
    }, 500)

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

        history.push(`/dashboard/${positionData.positionString}/${newHashedState}`)
    }

    const goBackToDashboard = () => {
        history.push(window.location.pathname.replace('admin', 'dashboard'))
    }

    const updateHiddenList = (clickedId, hiddenListType) => {
        const { hiddenLists, hashedState: newHashedState } = updateHiddenListAndHash(
            clickedId,
            ...hidden,
            ...stationsData,
            ...stopsData,
            distance,
            hiddenListType,
        )

        setHidden(hiddenLists)
        setHashedState(newHashedState)

        if (hiddenListType === 'transportModes') {
            getDataFromSDK(positionData.position, distance)
        }

        history.push(`/admin/${positionData.positionString}/${hashedState}`)
    }

    const updateHiddenListForAll = (checked, type) => {
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

    const getStyle = isHidden => {
        return isHidden ? null : { opacity: 0.3 }
    }

    const isHidden = (id, type) => {
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
            return hiddenModes.includes(id)
        }
        return hiddenRoutes.includes(id)
    }

    const handleTextInputChange = event => {
        const newDistance = event.target.value
        const { position } = positionData

        setDistance(newDistance)

        if (distance.length) {
            updateSearch(newDistance, position)
        }
    }

    const handleSliderChange = event => {
        const newDistance = event.target.value
        const { position } = positionData

        setDistance(newDistance)

        updateSearch(newDistance, position)
    }

    const handleAddNewStation = stations => {
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

        history.push(`/admin/${positionData.positionString}/${newHashedState}`)
    }

    const handleAddNewStop = newStop => {
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

            history.push(`/admin/${positionData.positionString}/${hashedState}`)
        })
    }

    const { stations } = stationsData
    const { stops } = stopsData
    const { position } = positionData
    const { hiddenModes } = hidden

    return (
        <div className="admin-container main-container">
            <AdminHeader goBackToDashboard={goBackToDashboard} />
            <div className="admin-content">
                <FilterPanel
                    isHidden={isHidden}
                    transportModes={transportModes}
                    distance={distance}
                    handleSliderChange={handleSliderChange}
                    handleTextInputChange={handleTextInputChange}
                    updateHiddenList={updateHiddenList}
                    getStyle={getStyle}
                    hiddenModes={hiddenModes}
                />
                <SelectionPanel
                    stops={stops}
                    stations={stations}
                    updateHiddenList={updateHiddenList}
                    updateHiddenListForAll={updateHiddenListForAll}
                    position={position}
                    onCheck={isHidden}
                    handleAddNewStop={handleAddNewStop}
                />
                <BikePanel
                    stations={stations}
                    updateHiddenList={updateHiddenList}
                    updateHiddenListForAll={updateHiddenListForAll}
                    onCheck={isHidden}
                    position={position}
                    handleAddNewStation={handleAddNewStation}
                />
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
