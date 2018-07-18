import React from 'react'
import EnturService from '@entur/sdk'
import moment from 'moment'
import './styles.css'
import { BikeTable, DepartureTable, DepartureTiles } from '../../components'
import { getSettingsFromUrl, getPositionFromUrl } from '../../utils'
import { Settings } from '../../components/icons'

const service = new EnturService()

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
        const { hiddenStations, hiddenStops, distance } = getSettingsFromUrl()
        service.getStopPlacesByPosition(position, distance).then(stops => {
            const stopsData = stops.map(stop => {
                return {
                    ...stop,
                    departures: [],
                }
            })
            this.setState({
                stopsData, distance, hiddenStations, hiddenStops, position,
            })
            this.stopPlaceDepartures()
            this.updateTime()
        })
        this.updateInterval = setInterval(this.updateTime, 10000)
    }

    stopPlaceDepartures = () => {
        const stops = this.state.stopsData
        stops.forEach((stop, index) => {
            service.getStopPlaceDepartures(stop.id, { onForBoarding: true, departures: 50 }).then(departures => {
                const lineData = departures.map(departure => {
                    const { expectedDepartureTime, destinationDisplay, serviceJourney } = departure
                    const { line } = serviceJourney.journeyPattern
                    const departureTime = moment(expectedDepartureTime)
                    const minDiff = departureTime.diff(moment(), 'minutes')

                    return {
                        type: line.transportMode,
                        time: this.formatDeparture(minDiff, departureTime),
                        route: line.publicCode + ' '+ destinationDisplay.frontText,
                    }
                })
                const newList = [...this.state.stopsData ]
                newList[index].departures = lineData

                this.setState({
                    stopsData: newList,
                })
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
            hiddenStations, hiddenStops, stationData, stopsData,
        } = this.state
        const visibleStopCount = stopsData.length - hiddenStops.length
        const visibleStationCount = stationData.length - hiddenStations.length
        const tileView = (stopsData.length + (stationData.length - hiddenStations.length > 0) - hiddenStops.length) < 5
        if (tileView) {
            return (
                <div className="departure-board">
                    <div className="button-wrap">
                        <button className="settings-button" onClick={(event) => this.onSettingsButton(event)} >admin</button>
                    </div>
                    <div className="departure-tiles">
                        {visibleStopCount > 0 ? <DepartureTiles lineData={stopsData} visible={hiddenStops}/> : null}
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
                    {visibleStopCount > 0 ? <DepartureTable lineData={stopsData} visible={hiddenStops}/> : null}
                    {visibleStationCount > 0 ? <BikeTable stationData={stationData} visible={hiddenStations} /> : null}
                </div>
            </div>
        )
    }
}

export default DepartureBoard
