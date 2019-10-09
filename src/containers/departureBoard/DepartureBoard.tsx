import React, {
    useEffect, useState, useCallback, useMemo,
} from 'react'
import { BikeRentalStation } from '@entur/sdk'

import './styles.scss'
import {
    BikeTable, DepartureTiles, Footer, Header,
} from '../../components'
import {
    getSettingsFromUrl,
    getPositionFromUrl,
    transformDepartureToLineData,
} from '../../utils'

import { DEFAULT_DISTANCE } from '../../constants'
import { StopPlaceWithDepartures } from '../../types'

// @ts-ignore
import errorImage from '../../assets/images/noStops.png'
import service from '../../service'

async function fetchBikeRentalStations(distance: number = DEFAULT_DISTANCE): Promise<Array<BikeRentalStation>> {
    const position = getPositionFromUrl()
    const settings = getSettingsFromUrl()

    const { newStations } = settings

    const [newBikeStations, geoBikeStations] = await Promise.all([
        Promise.all(newStations.map(stationId => service.getBikeRentalStation(stationId))),
        service.getBikeRentalStations(position, distance),
    ])

    return [...newBikeStations, ...geoBikeStations] // TODO: Filter duplicates
}

async function fetchStopPlaceDepartures(distance: number = DEFAULT_DISTANCE): Promise<Array<StopPlaceWithDepartures>> {
    const position = getPositionFromUrl()
    const settings = getSettingsFromUrl()

    const { newStops } = settings

    const [newStopPlaces, geoStopPlaces] = await Promise.all([
        Promise.all(newStops.map((stopId) => service.getStopPlace(stopId))),
        service.getStopPlacesByPosition(position, distance),
    ])

    const allStopPlaces = [...newStopPlaces, ...geoStopPlaces] // TODO: Filter duplicates

    const stopIds = allStopPlaces.map(({ id }) => id)

    const departures = await service.getStopPlaceDepartures(stopIds, {
        includeNonBoarding: false,
        departures: 50,
    })

    const stopPlacesWithDepartures = allStopPlaces.map(stop => {
        const departuresForThisStopPlace = departures.find(({ id }) => stop.id === id)
        if (!departuresForThisStopPlace || !departuresForThisStopPlace.departures) {
            return stop
        }
        return {
            ...stop,
            departures: departuresForThisStopPlace.departures.map(transformDepartureToLineData),
        }
    })

    return stopPlacesWithDepartures
}


const DepartureBoard = ({ history }) => {
    const [initialLoading, setInitialLoading] = useState<boolean>(false)
    const [stationData, setStationData] = useState<Array<BikeRentalStation>>([])
    const [stopsData, setStopsData] = useState<Array<StopPlaceWithDepartures>>([])
    const settings = useMemo(() => getSettingsFromUrl(), [])
    const { distance } = settings

    const refreshData = useCallback(async () => {
        const [stations, stops] = await Promise.all([
            fetchBikeRentalStations(distance),
            fetchStopPlaceDepartures(distance),
        ])

        setStationData(stations)
        setStopsData(stops)
    }, [distance])

    useEffect(() => {
        setInitialLoading(true)
        refreshData()
            .then(() => setInitialLoading(false))
            .catch(() => setInitialLoading(false))
    }, [refreshData])

    useEffect(() => {
        const timeout = setTimeout(refreshData, 30000)
        return () => clearTimeout(timeout)
    }, [refreshData])

    const onSettingsButtonClick = useCallback(event => {
        const path = window.location.pathname.split('@')[1]
        history.push(`/admin/@${path}`)
        event.preventDefault()
    }, [history])

    const { hiddenStations, hiddenStops } = settings

    const visibleStopCount = stopsData.length - hiddenStops.length
    const visibleStationCount = stationData.length - hiddenStations.length
    const noStops = visibleStopCount + visibleStationCount === 0

    return (
        <div className="main-container">
            <Header />
            {noStops && !initialLoading ? (
                <div className="no-stops">
                    <div className="no-stops-sheep">
                        <img src={errorImage} />
                    </div>
                </div>
            ) : (
                <div className="departure-board">
                    <div className="departure-tiles">
                        {visibleStopCount > 0 ? (
                            <DepartureTiles
                                lineData={stopsData}
                                visible={settings}
                            />
                        ) : null}
                        {visibleStationCount > 0 ? (
                            <BikeTable
                                stationData={stationData}
                                visible={settings}
                            />
                        ) : null}
                    </div>
                </div>
            )}
            <Footer history={history} onSettingsButtonClick={onSettingsButtonClick} />
        </div>
    )
}

export default DepartureBoard
