import React from 'react'
import EnturService from '@entur/sdk'
import { getIcon, getPositionFromUrl, getSettingsFromUrl } from '../../utils'
import './styles.css'

const service = new EnturService()


class AdminPage extends React.Component {
    state = {
        distance: 500,
        stations: [],
        stops: [],
        hiddenStations: [],
        hiddenStops: [],
        position: {},
        positionString: '',
        hashedState: '',
    }

    componentDidMount() {
        const position = getPositionFromUrl()
        const positionString = window.location.pathname.split('/')[2]
        const { hiddenStations, hiddenStops, distance } = getSettingsFromUrl()
        service.getBikeRentalStations(position, distance).then(stations => {
            this.setState({
                stations,
            })
        })
        service.getStopPlacesByPosition(position, distance).then(stops => {
            this.setState({
                stops,
            })
        })
        const hashedState = window.location.pathname.split('/')[3]
        this.setState({
            distance,
            hashedState,
            hiddenStops,
            hiddenStations,
            position,
            positionString,
        })
    }

    handleChange = (event) => {
        const distance = event.target.value
        const { position } = this.state
        service.getBikeRentalStations(position, distance).then(stations => {
            this.setState({
                stations,
                distance,
            })
        })
        service.getStopPlacesByPosition(position, distance).then(stops => {
            this.setState({
                stops,
            })
        })
        event.preventDefault()
    }

    handleSubmit = (event) => {
        const {
            distance, hiddenStations, hiddenStops, positionString,
        } = this.state
        const savedSettings = {
            distance,
            hiddenStations,
            hiddenStops,
        }
        const hashedState = btoa(JSON.stringify(savedSettings))
        this.setState({ hashedState })
        this.props.history.push(`/admin/${positionString}/${hashedState}`)
        event.preventDefault()
    }

    removeStation = (clickedId) => {
        const {
            hiddenStations, hiddenStops, positionString, distance,
        } = this.state
        let newSet = hiddenStations
        if (hiddenStations.includes(clickedId)) {
            newSet = newSet.filter((id) => id !== clickedId)
        }
        else {
            newSet.push(clickedId)
        }
        const savedSettings = {
            distance,
            hiddenStations: newSet,
            hiddenStops,
        }
        const hashedState = btoa(JSON.stringify(savedSettings))
        this.setState({
            hiddenStations: newSet,
            hashedState,
        })
        this.props.history.push(`/admin/${positionString}/${hashedState}`)
    }

    removeStops = (clickedId) => {
        const {
            hiddenStops, hiddenStations, positionString, distance,
        } = this.state
        let newSet = hiddenStops
        if (hiddenStops.includes(clickedId)) {
            newSet = newSet.filter((id) => id !== clickedId)
        }
        else {
            newSet.push(clickedId)
        }
        const savedSettings = {
            distance,
            hiddenStops: newSet,
            hiddenStations,
        }
        const hashedState = btoa(JSON.stringify(savedSettings))
        this.setState({
            hiddenStops: newSet,
            hashedState,
        })
        this.props.history.push(`/admin/${positionString}/${hashedState}`)
    }

    getStyle = (id, type) => {
        const { hiddenStops, hiddenStations } = this.state
        if (type === 'stations') {
            const onStyle = !hiddenStations.includes(id)
            return onStyle ? null : { opacity: 0.3 }
        }
        const onStyle = !hiddenStops.includes(id)
        return onStyle ? null : { opacity: 0.3 }
    }

    onHomeButton = (event) => {
        const { hashedState, positionString } = this.state
        this.props.history.replace(`/dashboard/${positionString}/${hashedState}`)
        event.preventDefault()
    }

    render() {
        const { distance, stations, stops } = this.state
        return (
            <div className="adminContent" >
                <div className="admin-header">
                    <h1>Admin</h1>
                    <button className="close-button" onClick={(event) => this.onHomeButton(event)}>X</button>
                </div>
                <div className="distance" >
                    <p>{distance} meter</p>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Distance:
                            <input id="typeinp" type="range" min="200" max="5000" defaultValue="500" step="100" onChange={this.handleChange}/>
                        </label>
                        <button type="submit" value="Submit">Update</button>
                    </form>
                </div>
                <div className="stations">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Fjern sykkelstasjon</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                stations.map(({
                                    name, id,
                                }) => {
                                    return (
                                        <tr style={this.getStyle(id, 'stations')} key={id}>
                                            <td>{getIcon('bike')}</td>
                                            <td>{name}</td>
                                            <td>
                                                <button onClick={() => this.removeStation(id)}>X</button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div className="stops">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Fjern busstopp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                stops.map(({
                                    name, id, transportMode,
                                }) => {
                                    return (
                                        <tr style={this.getStyle(id, 'stops')} key={id}>
                                            <td>{getIcon(transportMode)}</td>
                                            <td>{name}</td>
                                            <td>
                                                <button onClick={() => this.removeStops(id)}>X</button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default AdminPage
