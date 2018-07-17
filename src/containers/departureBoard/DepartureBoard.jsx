import React from 'react'
import EnturService from '@entur/sdk'
import moment from 'moment'
import './styles.css'
import { BikeTable, DepartureTable, DepartureTiles } from '../../components/tables'

const service = new EnturService()

class DepartureBoard extends React.Component {
    state = {
        stationData: [],
        stopsData: [],
    }

    updateInterval = undefined

    componentDidMount() {
        const pos = this.getPositonFromUrl()
        service.getStopPlacesByPosition(pos, 200).then(stops => {
            const stopsData = stops.map(stop => {
                return {
                    ...stop,
                    departures: [],
                }
            })
            this.setState({ stopsData })
            this.stopPlaceDepartures()
            this.updateTime()
        })
        this.updateInterval = setInterval(this.updateTime, 10000)
    }

    stopPlaceDepartures = () => {
        const stops = this.state.stopsData
        stops.forEach((stop, index) => {
            service.getStopPlaceDepartures(stop.id, { onForBoarding: true, departures: 10 }).then(departures => {
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
        return minDiff < 1 ? 'nå' : minDiff.toString() + 'min'
    }

    getPositonFromUrl() {
        const positionArray = window.location.pathname.split(/@/)[1].split('-').join('.').split(/,/)
        return { latitude: positionArray[0], longitude: positionArray[1] }
    }

    updateTime = () => {
        const pos = this.getPositonFromUrl()
        service.getBikeRentalStations(pos, 200).then(stations => {
            this.setState({
                stationData: stations,
            })
        })
        this.stopPlaceDepartures()
    }


    componentWillUnmount() {
        clearInterval(this.updateInterval)
    }

    render() {
        const tileView = (this.state.stopsData.length + this.state.stationData.length) < 5
        return (
            <div className="departure">
                {this.state.stopsData.length > 0 && tileView ? <DepartureTiles lineData={this.state.stopsData}/> : null}
                {this.state.stopsData.length > 0 && !tileView ? <DepartureTable lineData={this.state.stopsData}/> : null}
                {this.state.stationData.length > 0 ? <BikeTable stationData={this.state.stationData} /> : null}
            </div>
        )
    }
}

export default DepartureBoard
