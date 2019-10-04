import React, { useEffect, useState } from 'react'
import moment from 'moment'
import './styles.scss'
import {
    BikeTable, DepartureTiles, Footer, Header,
} from '../../components'
import {
    getSettingsFromUrl,
    getPositionFromUrl,
    getStopPlacesByPositionAndDistance,
    sortLists,
    formatDeparture,
} from '../../utils'
import { DEFAULT_DISTANCE } from '../../constants'
import errorImage from '../../assets/images/noStops.png'
import service from '../../service'

function NoStopsInfo() {
    return (
        <div className="no-stops">
            <div className="no-stops-sheep">
                <img src={errorImage} />
            </div>
        </div>
    )
}

function getLineData(departure) {
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

function fetchBikeRentalStations(stationIds) {
    return Promise.all(stationIds.map(stationId => {
        return service.getBikeRentalStation(stationId)
    }))
}

function fetchStopPlaceDepartures(stopsData) {
    return service
        .getStopPlaceDepartures(stopsData.map(({ id }) => id), {
            includeNonBoarding: false,
            departures: 50,
        })
        .then(departures => {
            const computedStops = stopsData.map(stop => {
                const resultForThisStop = departures.find(({ id }) => stop.id === id)
                if (!resultForThisStop || !resultForThisStop.departures) {
                    return stop
                }
                return {
                    ...stop,
                    departures: resultForThisStop.departures.map(getLineData),
                }
            })

            return computedStops
        })
}

const DepartureBoard = ({ history }) => {
    const [initialLoading, setInitialLoading] = useState(false)
    const [stationData, setStationData] = useState([])
    const [stopsData, setStopsData] = useState([])
    const [hidden, setHidden] = useState({
        hiddenStations: [],
        hiddenRoutes: [],
        hiddenStops: [],
        hiddenModes: [],
    })
    const [distance, setDistance] = useState(DEFAULT_DISTANCE)
    const [position, setPosition] = useState(null)

    const updateStopPlaceDepartures = (stopPlaces) => {
        fetchStopPlaceDepartures(stopPlaces)
            .then(computedStops => setStopsData(computedStops))
    }

    useEffect(() => {
        setInitialLoading(true)

        const newPosition = getPositionFromUrl()
        const {
            hiddenStations,
            hiddenStops,
            hiddenRoutes,
            distance: newDistance,
            hiddenModes,
            newStops,
        } = getSettingsFromUrl()

        getStopPlacesByPositionAndDistance(newPosition, newDistance)
            .then(data => {
                setStopsData(data)
                setDistance(newDistance)
                setHidden({
                    hiddenStations,
                    hiddenStops,
                    hiddenRoutes,
                    hiddenModes,
                })
                setPosition(newPosition)
                setInitialLoading(false)

                updateStopPlaceDepartures(data)

                Promise.all(newStops.map((stopId) => service.getStopPlace(stopId)))
                    .then(stopPlaces => updateStopPlaceDepartures(stopPlaces))
            })
            .catch(e => {
                setInitialLoading(false)
                console.error(e) // eslint-disable-line no-console
            })
    }, [])

    useEffect(() => {
        const updateInterval = setInterval(() => {
            const { newStations } = getSettingsFromUrl()
            service
                .getBikeRentalStations(position, distance)
                .then(stations => {
                    setStationData(stations)
                })
                .then(() => {
                    fetchBikeRentalStations(newStations).then(stations => {
                        const allStations = sortLists(stationData, stations)
                        setStationData(allStations)
                    })
                })
            updateStopPlaceDepartures(stopsData)
        }, 30000)
        return () => clearInterval(updateInterval)
    }, [distance, position, stationData, stopsData])

    const onSettingsButtonClick = event => {
        const path = window.location.pathname.split('@')[1]
        history.push(`/admin/@${path}`)
        event.preventDefault()
    }

    const {
        hiddenStations, hiddenStops, hiddenRoutes, hiddenModes,
    } = hidden

    const visibleStopCount = stopsData.length - hiddenStops.length
    const visibleStationCount = stationData.length - hiddenStations.length
    const noStops = visibleStopCount + visibleStationCount === 0

    return (
        <div className="main-container">
            <Header />
            {noStops && !initialLoading ? (
                <NoStopsInfo />
            ) : (
                <div className="departure-board">
                    <div className="departure-tiles">
                        {visibleStopCount > 0 ? (
                            <DepartureTiles
                                lineData={stopsData}
                                visible={{
                                    hiddenStops,
                                    hiddenRoutes,
                                    hiddenModes,
                                }}
                            />
                        ) : null}
                        {visibleStationCount > 0 ? (
                            <BikeTable
                                stationData={stationData}
                                visible={{
                                    hiddenStations,
                                    hiddenModes,
                                }}
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
