import React from 'react'
import EnturService from '@entur/sdk'
import moment from 'moment'
import './styles.css'
import { BikeTable, DepartureTable, DepartureTiles } from '../../components'
import { getSettingsFromUrl, getPositionFromUrl } from '../../utils'

const service = new EnturService()

class DepartureBoard extends React.Component {
    state = {
        stationData: [],
        stopsData: [],
        distance: 500,
        hiddenSet: [],
        position: '',
    }

    updateInterval = undefined

    componentDidMount() {
        const position = getPositionFromUrl()
        const { hiddenSet, distance } = getSettingsFromUrl()
        service.getStopPlacesByPosition(position, distance).then(stops => {
            const stopsData = stops.map(stop => {
                return {
                    ...stop,
                    departures: [],
                }
            })
            this.setState({
                stopsData, distance, hiddenSet, position,
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
        const { hiddenSet, stationData, stopsData } = this.state
        const tileView = (stopsData.length + stationData.length) < 5
        if (tileView) {
            return (
                <div className="departure-board">
                    <div className="button-wrap">
                        <button className="settings-button" onClick={(event) => this.onSettingsButton(event)} >admin</button>
                    </div>
                    <div className="departure-tiles">
                        {stopsData.length > 0 ? <DepartureTiles lineData={stopsData}/> : null}
                        {stationData.length > 0 ? <BikeTable stationData={stationData} visible={hiddenSet} /> : null}
                    </div>
                </div>
            )
        }
        return (
            <div className="departure-board">
                <div className="button-wrap">
                    <button className="settings-button" onClick={(event) => this.onSettingsButton(event)} >admin</button>
                </div>
                <div className="departure-table">
                    {stopsData.length > 0 ? <DepartureTable lineData={stopsData}/> : null}
                    {stationData.length > 0 ? <BikeTable stationData={stationData} visible={hiddenSet} /> : null}
                </div>
            </div>
        )
    }
}

export default DepartureBoard
