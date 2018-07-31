import React from 'react'
import EnturService from '@entur/sdk'
import moment from 'moment'
import './styles.scss'
import { BikeTable, DepartureTiles } from '../../components'
import { getSettingsFromUrl, getPositionFromUrl, getStopPlacesByPositionAndDistance } from '../../utils'
import { DEFAULT_DISTANCE } from '../../constants'
import { Settings } from '../../assets/icons'
import Footer from '../../components/Footer'
import Header from '../../components/header/Header'

const service = new EnturService({ clientName: 'entur-tavla' })

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
        getStopPlacesByPositionAndDistance(position, distance).then(stopsData => {
            this.setState({
                stopsData, distance, hiddenStations, hiddenStops, hiddenRoutes, hiddenModes, position,
            })
            this.stopPlaceDepartures()
            this.updateTime()
        })
        this.updateInterval = setInterval(this.updateTime, 10000)
    }

    getLineData = departure => {
        const { expectedDepartureTime, destinationDisplay, serviceJourney } = departure
        const { line } = serviceJourney.journeyPattern
        const departureTime = moment(expectedDepartureTime)
        const minDiff = departureTime.diff(moment(), 'minutes')

        return {
            type: line.transportMode,
            time: this.formatDeparture(minDiff, departureTime),
            route: line.publicCode + ' '+ destinationDisplay.frontText,
        }
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
        service.getBikeRentalStations(position, distance).then(stations => {
            this.setState({
                stationData: stations,
            })
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


    render() {
        const {
            hiddenStations, hiddenStops, hiddenRoutes, stationData, stopsData, hiddenModes,
        } = this.state
        const visibleStopCount = stopsData.length - hiddenStops.length
        const visibleStationCount = stationData.length - hiddenStations.length
        return (
            <div>
                <Header />
                <div className="departure-board">
                    <div className="button-wrap">
                        <button className="settings-button" onClick={(event) => this.onSettingsButton(event)} ><Settings /></button>
                    </div>
                    <div className="departure-tiles">
                        {visibleStopCount > 0 ? <DepartureTiles lineData={stopsData} visible={{ hiddenStops, hiddenRoutes, hiddenModes }}/> : null}
                        {visibleStationCount > 0 ? <BikeTable stationData={stationData} visible={{ hiddenStations, hiddenModes }} /> : null}
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

export default DepartureBoard
