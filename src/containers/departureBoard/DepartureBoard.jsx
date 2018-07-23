import React from 'react'
import EnturService from '@entur/sdk'
import moment from 'moment'
import './styles.css'
import { BikeTable, DepartureTables, DepartureTiles } from '../../components'
import { getSettingsFromUrl, getPositionFromUrl, getStopPlacesByPositionAndDistance } from '../../utils'
import { Settings } from '../../components/icons'

const service = new EnturService({ clientName: 'entur-tavla' })

class DepartureBoard extends React.Component {
    state = {
        stationData: [],
        stopsData: [],
        distance: 500,
        hiddenStations: [],
        hiddenStops: [],
        position: '',
    }

    updateInterval = undefined

    componentDidMount() {
        const position = getPositionFromUrl()
        const {
            hiddenStations, hiddenStops, hiddenRoutes, distance,
        } = getSettingsFromUrl()
        getStopPlacesByPositionAndDistance(position, distance).then(stopsData => {
            this.setState({
                stopsData, distance, hiddenStations, hiddenStops, hiddenRoutes, position,
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
            hiddenStations, hiddenStops, hiddenRoutes, stationData, stopsData,
        } = this.state
        const visibleStopCount = stopsData.length - hiddenStops.length
        const visibleStationCount = stationData.length - hiddenStations.length
        const tileView = (stopsData.length + (stationData.length - hiddenStations.length > 0) - hiddenStops.length) < 5
        if (tileView) {
            return (
                <div className="departure-board">
                    <div className="button-wrap">
                        <button className="settings-button" onClick={(event) => this.onSettingsButton(event)} ><Settings /></button>
                    </div>
                    <div className="departure-tiles">
                        {visibleStopCount > 0 ? <DepartureTiles lineData={stopsData} visible={{ hiddenStops, hiddenRoutes }}/> : null}
                        {visibleStationCount > 0 ? <BikeTable stationData={stationData} visible={hiddenStations} /> : null}
                    </div>
                </div>
            )
        }
        return (
            <div className="departure-board">
                <div className="button-wrap">
                    <button className="settings-button" onClick={(event) => this.onSettingsButton(event)} >
                        <Settings />
                    </button>
                </div>
                <div className="departure-table">
                    {visibleStopCount > 0 ? <DepartureTables lineData={stopsData} visible={{ hiddenStops, hiddenRoutes }}/> : null}
                    {visibleStationCount > 0 ? <BikeTable stationData={stationData} visible={hiddenStations} /> : null}
                </div>
            </div>
        )
    }
}

export default DepartureBoard
