import React from 'react'
import EnturService from '@entur/sdk'
import moment from 'moment'
import './styles.css'
import { BikeTable, DepartureTable } from '../../components/tables'

const service = new EnturService()

class DepartureBoard extends React.Component {
    state = {
        stationData: [],
        stopsData: [],
    }

    updateInterval = undefined

    componentDidMount() {
        const pos = this.getPositonFromUrl()
        service.getStopPlacesByPosition(pos, 300).then(stops => {
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
                        destination: destinationDisplay.frontText,
                        type: line.transportMode,
                        code: line.publicCode,
                        time: minDiff < 15 ? (minDiff.toString() + 'min') : departureTime.format('HH:mm'),
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
        return (
            <div className="app">
                <div className="main-content">
                    <h1>Avgangstider</h1>
                    <div className="departure">
                        <div className="departure-table">
                            <div className="content-title">
                                <h3>
                                    Platform
                                </h3>
                                <hr />
                            </div>
                            {this.state.stopsData.length > 0 ? <DepartureTable lineData={this.state.stopsData}/> : null}
                        </div>
                        <div className="departure-table">
                            <div className="content-title">
                                <h3>
                                    Bysykkel
                                </h3>
                                <hr />
                            </div>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="time">Ledig</th>
                                        <th className="type">Sted</th>
                                    </tr>
                                </thead>
                                {this.state.stationData.length > 0 ? <BikeTable stationData={this.state.stationData} /> : null}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DepartureBoard
