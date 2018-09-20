import React from 'react'
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
import Settings from '../../assets/icons/settings/settings.js'
import errorImage from '../../assets/images/noStops.png'
import service from '../../service'

class DepartureBoard extends React.Component {
    state = {
        stationData: [],
        stopsData: [],
        distance: DEFAULT_DISTANCE,
        hiddenStations: [],
        hiddenStops: [],
        hiddenRoutes: [],
        hiddenModes: [],
        position: '',
    }

    updateInterval = undefined

    componentDidMount() {
        const position = getPositionFromUrl()
        const {
            hiddenStations, hiddenStops, hiddenRoutes, distance, hiddenModes,
        } = getSettingsFromUrl()
        this.setState({
            initialLoading: true,
        })

        getStopPlacesByPositionAndDistance(position, distance)
            .then(stopsData => {
                this.setState({
                    stopsData,
                    distance,
                    hiddenStations,
                    hiddenStops,
                    hiddenRoutes,
                    hiddenModes,
                    position,
                    initialLoading: false,
                })
            }).then(() => {
                this.initializeStopsData()
                this.updateTime()
            })
            .catch(e => {
                this.setState({ initialLoading: false })
                console.error(e) // eslint-disable-line no-console
            })
        this.updateInterval = setInterval(this.updateTime, 10000)
    }

    getHashedBikeStations = (newStations) => {
        return newStations.forEach(stationId => {
            service.getBikeRentalStation(stationId).then(station => {
                const allStations = sortLists(this.state.stationData, [station])
                this.setState({
                    stationData: allStations,
                })
            })
        })
    }

    getLineData = departure => {
        const { expectedDepartureTime, destinationDisplay, serviceJourney } = departure
        const { line } = serviceJourney.journeyPattern
        const departureTime = moment(expectedDepartureTime)
        const minDiff = departureTime.diff(moment(), 'minutes')

        const route = `${line.publicCode || ''} ${destinationDisplay.frontText}`.trim()

        return {
            type: line.transportMode,
            time: this.formatDeparture(minDiff, departureTime),
            route,
        }
    }

    initializeStopsData = () => {
        const { newStops } = getSettingsFromUrl()

        const newStopsList = newStops.map(stopId => {
            return service.getStopPlace(stopId).then(stop => {
                return stop
            })
        })

        Promise.all(newStopsList).then(data => {
            const { stopsData } = this.state
            const stops = sortLists(stopsData, data)
            service.getStopPlaceDepartures(stops.map(({ id }) => id), { onForBoarding: true, departures: 50 }).then(departures => {
                this.setState({
                    stopsData: stops.map(stop => {
                        const resultForThisStop = departures.find(({ id }) => stop.id === id)
                        if (!resultForThisStop || !resultForThisStop.departures) {
                            return stop
                        }
                        return {
                            ...stop,
                            departures: resultForThisStop.departures.map(this.getLineData),
                        }
                    }),
                })
            })
        })
    }

    stopPlaceDepartures = () => {
        const { stopsData } = this.state
        service.getStopPlaceDepartures(stopsData.map(({ id }) => id), { onForBoarding: true, departures: 50 }).then(departures => {
            this.setState({
                stopsData: stopsData.map(stop => {
                    const resultForThisStop = departures.find(({ id }) => stop.id === id)
                    if (!resultForThisStop || !resultForThisStop.departures) {
                        return stop
                    }
                    return {
                        ...stop,
                        departures: resultForThisStop.departures.map(this.getLineData),
                    }
                }),
            })
        })
    }

    formatDeparture(minDiff, departureTime) {
        if (minDiff > 15) return departureTime.format('HH:mm')
        return minDiff < 1 ? 'nå' : minDiff.toString() + ' min'
    }

    updateTime = () => {
        const { position, distance } = this.state
        const { newStations } = getSettingsFromUrl()

        service.getBikeRentalStations(position, distance).then(stations => {
            this.setState({
                stationData: stations,
            })
        }).then(() => {
            this.getHashedBikeStations(newStations)
        })
        this.stopPlaceDepartures()
    }

    componentWillUnmount() {
        clearInterval(this.updateInterval)
    }

    onSettingsButton = (event) => {
        const path = window.location.pathname.split('@')[1]
        this.props.history.push(`/admin/@${path}`)
        event.preventDefault()
    }

    renderAdminButton = () => {
        return (
            <div>
                <button className="settings-button" onClick={(event) => this.onSettingsButton(event)} >
                    <Settings height={20} width={20}/>
                </button>
            </div>
        )
    }

    renderNoStopsInfo = () => (
        <div className="no-stops">
            <div className="no-stops-sheep">
                <img src={errorImage} />
            </div>
        </div>
    )

    render() {
        const {
            hiddenStations, hiddenStops, hiddenRoutes, stationData, stopsData, hiddenModes, initialLoading,
        } = this.state
        const visibleStopCount = stopsData.length - hiddenStops.length
        const visibleStationCount = stationData.length - hiddenStations.length
        const noStops = (visibleStopCount + visibleStationCount) === 0

        return (
            <div>
                <Header />
                {(noStops && !initialLoading)
                    ? this.renderNoStopsInfo()
                    : <div>
                        <div className="departure-board">
                            <div className="departure-tiles">
                                {visibleStopCount > 0 ? <DepartureTiles lineData={stopsData} visible={{ hiddenStops, hiddenRoutes, hiddenModes }}/> : null}
                                {visibleStationCount > 0 ? <BikeTable stationData={stationData} visible={{ hiddenStations, hiddenModes }} /> : null}
                            </div>
                        </div>
                    </div>}
                <Footer settingsButton={this.renderAdminButton()} history={this.props.history}/>
            </div>
        )
    }
}

export default DepartureBoard
