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
} from '../../utils'
import { DEFAULT_DISTANCE } from '../../constants'
import errorImage from '../../assets/images/noStops.png'
import service from '../../service'

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
    const [distance, setdistance] = useState(DEFAULT_DISTANCE)
    const [position, setPosition] = useState(null)

    let updateInterval = null

    const initializeStopsData = () => {
        const { newStops } = getSettingsFromUrl()

        Promise.all(newStops.map(stopId => service.getStopPlace(stopId))).then(data => {
            const stops = sortLists(stopsData, data)

            service
                .getStopPlaceDepartures(stops.map(({ id }) => id), {
                    includeNonBoarding: false,
                    departures: 50,
                })
                .then(departures => {
                    const computedStops = stops.map(stop => {
                        const resultForThisStop = departures.find(({ id }) => stop.id === id)
                        if (!resultForThisStop || !resultForThisStop.departures) {
                            return stop
                        }
                        return {
                            ...stop,
                            departures: resultForThisStop.departures.map(getLineData),
                        }
                    })

                    setStopsData(computedStops)
                })
        })
    }

    const updateTime = () => {
        const { newStations } = getSettingsFromUrl()

        service
            .getBikeRentalStations(position, distance)
            .then(stations => {
                setStationData(stations)
            })
            .then(() => {
                getHashedBikeStations(newStations)
            })
        stopPlaceDepartures()
    }

    useEffect(() => {
        const newPosition = getPositionFromUrl()
        const {
            hiddenStations,
            hiddenStops,
            hiddenRoutes,
            distance: newDistance,
            hiddenModes,
        } = getSettingsFromUrl()

        setInitialLoading(true)

        getStopPlacesByPositionAndDistance(newPosition, newDistance)
            .then(data => {
                setStopsData(data)

                setdistance(newDistance)

                setHidden({
                    hiddenStations,
                    hiddenStops,
                    hiddenRoutes,
                    hiddenModes,
                })

                setPosition(newPosition)

                setInitialLoading(false)
            })
            .then(() => {
                initializeStopsData()
                updateTime()
            })
            .catch(e => {
                setInitialLoading(false)
                console.error(e) // eslint-disable-line no-console
            })
        updateInterval = setInterval(updateTime, 30000)

        return () => {
            clearInterval(updateInterval)
        }
    }, [
        getPositionFromUrl,
        getSettingsFromUrl,
        getStopPlacesByPositionAndDistance,
        initializeStopsData,
        updateTime,
    ])

    const getHashedBikeStations = newStations => {
        return newStations.forEach(stationId => {
            service.getBikeRentalStation(stationId).then(station => {
                const allStations = sortLists(stationData, [station])
                setStationData(allStations)
            })
        })
    }

    const getLineData = departure => {
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

    const stopPlaceDepartures = () => {
        service
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

                setStopsData(computedStops)
            })
    }

    const formatDeparture = (minDiff, departureTime) => {
        if (minDiff > 15) return departureTime.format('HH:mm')
        return minDiff < 1 ? 'nå' : minDiff.toString() + ' min'
    }

    const onSettingsButtonClick = event => {
        const path = window.location.pathname.split('@')[1]

        history.push(`/admin/@${path}`)

        event.preventDefault()
    }

    const renderNoStopsInfo = () => (
        <div className="no-stops">
            <div className="no-stops-sheep">
                <img src={errorImage} />
            </div>
        </div>
    )

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
                renderNoStopsInfo()
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
