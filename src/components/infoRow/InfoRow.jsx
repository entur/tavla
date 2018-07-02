import React from 'react'
import EnturService from '@entur/sdk'
import './styles.css'

const service = new EnturService()
const now = new Date()

const toTimeString = (date) => {
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    return `${hour}:${minute}`
}

const minutesDifference = (date1, date2) => {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime())
    return Math.floor(timeDiff / (1000 * 60))
}

class InfoRow extends React.Component {
    state = {
        lineData: [],
    }

    updateInterval = undefined

    updateTime = () => {
        service.getStopPlaceDepartures('NSR:StopPlace:4227').then(departures => {
            const lineData = departures.filter(departure => departure && departure.forBoarding).map(departure => {
                const { expectedDepartureTime, destinationDisplay, serviceJourney } = departure
                const { line } = serviceJourney.journeyPattern
                const departureTime = new Date(expectedDepartureTime)
                const minDiff = minutesDifference(now, departureTime)
                return {
                    destination: destinationDisplay.frontText,
                    type: line.transportMode,
                    code: line.publicCode,
                    time: (minDiff < 15 ? minDiff : toTimeString(departureTime)),
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

    render() {
        const { lineData } = this.state
        return (
            <div>
                <div className="list">
                    {lineData.map((departure, index) => (
                        <div className="row" key={index}>
                            <div className="icon">{departure.type}</div>
                            <div className="route">
                                {departure.code} {departure.destination}
                            </div>
                            <div className="time">{departure.time}</div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default InfoRow
