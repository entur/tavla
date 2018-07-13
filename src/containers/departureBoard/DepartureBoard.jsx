import React from 'react'
import EnturService from '@entur/sdk'
import moment from 'moment'
import './styles.css'
import {
    Bus, CityBike, Metro, Ferry, Train, Tram,
} from '../../components/icons'

const service = new EnturService()
const latlong = JSON.parse(window.localStorage.getItem('initialData'))

const position = {
    latitude: latlong.lat,
    longitude: latlong.lat,
}

function getIcon(type, props) {
    switch (type) {
        case 'bus':
            return <Bus {...props} />
        case 'bike':
            return <CityBike {...props} />
        case 'ferry':
            return <Ferry {...props} />
        case 'metro':
            return <Metro {...props} />
        case 'train':
            return <Train {...props} />
        case 'tram':
            return <Tram {...props} />
        default:
            return null
    }
}

class DepartureBoard extends React.Component {
    state = {
        stationData: [],
        stopsData: [],
    }

    updateInterval = undefined

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
                        time: this.formatDeparture(minDiff, departureTime),
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

    updateTime = () => {
        service.getBikeRentalStations(position, 200).then(stations => {
            this.setState({
                stationData: stations,
            })
        })
        this.stopPlaceDepartures()
    }

    componentDidMount() {
        service.getStopPlacesByPosition(position, 200).then(stops => {
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

    componentWillUnmount() {
        clearInterval(this.updateInterval)
    }


    renderBikeStationList() {
        const stationData = this.state.stationData

        return stationData.map(({
            name, bikesAvailable, spacesAvailable, id,
        }) => {
            return (
                <tr className="row" key={id}>
                    <td className="time">{bikesAvailable}/{bikesAvailable+spacesAvailable}</td>
                    <td className="type">{getIcon('bike')}</td>
                    <td className="route">{name}</td>
                </tr>
            )
        })
    }

    renderStopPlaces() {
        const lineData = this.state.stopsData
        return lineData.map(({ id, name, departures }) => {
            return (
                <div className="stop-place" key={id}>
                    <h3>{name}</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="time">Avgang</th>
                                <th className="type">Linje</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderDepartures(departures)}
                        </tbody>
                    </table>
                </div>
            )
        })
    }

    renderDepartures(departures) {
        return (departures.map(({
            time, type, code, destination,
        }, index) => {
            return (
                <tr className="row" key={index}>
                    <td className="time">{time}</td>
                    <td className="type">{getIcon(type)}</td>
                    <td className="route">
                        {code} {destination}
                    </td>
                </tr>
            )
        }))
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
                            {this.state.stopsData.length > 0 ? this.renderStopPlaces() : null}
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
                                <tbody>
                                    {this.state.stationData.length > 0 ? this.renderBikeStationList() : null}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DepartureBoard
