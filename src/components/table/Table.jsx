import React from 'react'
import EnturService from '@entur/sdk'
import './styles.css'
import moment from 'moment'
import { Bus, CityBike } from '../icons'

const service = new EnturService()

function getIcon(type, props) {
    switch (type) {
        case 'bus':
            return <Bus color="#5AC39A" {...props} />
        case 'bike':
            return <CityBike {...props} />
        default:
            return null
    }
}

class Table extends React.Component {
    state = {
        lineData: [],
        stationData: [],
    }

    updateInterval = undefined

    updateTime = () => {
        Promise.all([
            service.getBikeRentalStation("278"),
            service.getBikeRentalStation("249")
        ]).then(([east, west]) => {
            this.setState({
                stationData: [east, west]
            })
        })
        service.getStopPlaceDepartures('NSR:StopPlace:4227').then(departures => {
            const lineData = departures.filter(departure => departure && departure.forBoarding).map(departure => {
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
            this.setState({ lineData })
        })
    }

    componentDidMount() {
        this.updateTime()
        this.updateInterval = setInterval(this.updateTime, 10000)
    }

    componentWillUnmount() {
        clearInterval(this.updateInterval)
    }

    renderList() {
        const { lineData } = this.state

        return lineData.map(({
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
        })
    }

    renderBikeStationList() {
        const { stationData } = this.state

        return stationData.map(({
            name, bikesAvailable, spacesAvailable, id
        }, index) => {
            return (
                <tr className="row" key={id}>
                    <td className="time">{spacesAvailable}/{bikesAvailable}</td>
                    <td className="type">{getIcon('bike')}</td>
                    <td className="route">{name}</td>
                </tr>
            )
        })
    }

    render() {

        return (
            <div>
                <h1>Avgangstider</h1>
                <h2>Vippetangen</h2>
                <div className="departure">
                    <div className="departure-table">
                        <div className="content-title">
                            <h3>
                                Platform
                            </h3>
                            <hr />
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="time">Avgang</th>
                                    <th className="type">Linje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderList()}
                            </tbody>
                        </table>
                        <div className="list" />
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
                                {this.renderBikeStationList()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default Table
