import React from 'react'
import EnturService from '@entur/sdk'
import debounce from 'lodash.debounce'
import { SortPanel } from '../../components'
import {
    getIcon,
    getPositionFromUrl,
    getSettingsFromUrl,
    getStopsWithUniqueStopPlaceDepartures,
    getStopPlacesByPositionAndDistance,
    getSettingsHash,
    updateHiddenListAndHash,
    minutesToDistance,
} from '../../utils'
import DEFAULT_DISTANCE from '../../constants'
import './styles.scss'

const service = new EnturService({ clientName: 'entur-tavla' })


class AdminPage extends React.Component {
    state = {
        distance: DEFAULT_DISTANCE,
        stations: [],
        stops: [],
        hiddenStations: [],
        hiddenStops: [],
        hiddenRoutes: [],
        position: {},
        positionString: '',
        hashedState: '',
    }

    componentDidMount() {
        const position = getPositionFromUrl()
        const positionString = window.location.pathname.split('/')[2]
        const {
            hiddenStations, hiddenStops, distance, hiddenRoutes,
        } = getSettingsFromUrl()
        this.getDataFromSDK(position, distance)
        const hashedState = window.location.pathname.split('/')[3]
        this.setState({
            distance,
            hashedState,
            hiddenStops,
            hiddenStations,
            hiddenRoutes,
            position,
            positionString,
        })
    }

    getDataFromSDK(position, distance) {
        service.getBikeRentalStations(position, distance).then(stations => {
            this.setState({
                stations,
            })
        })
        getStopPlacesByPositionAndDistance(position, distance).then(stops => {
            getStopsWithUniqueStopPlaceDepartures(stops).then((uniqueRoutes) => {
                this.setState({
                    stops: uniqueRoutes,
                })
            })
        })
    }

    updateSearch = debounce((distance, position) => {
        this.getDataFromSDK(position, distance)
    }, 500)

    goToDashboard = () => {
        const {
            distance, hiddenStations, hiddenStops, positionString, hiddenRoutes,
        } = this.state
        const hashedState = getSettingsHash(distance, hiddenStations, hiddenStops, hiddenRoutes)
        this.setState({ hashedState })
        this.props.history.push(`/dashboard/${positionString}/${hashedState}`)
    }

    updateURL = () => {}

    updateHiddenList(clickedId, hiddenList) {
        const {
            hiddenLists, hashedState,
        } = updateHiddenListAndHash(clickedId, this.state, hiddenList)
        const { hiddenStations, hiddenStops, hiddenRoutes } = hiddenLists
        this.setState({
            hiddenStations,
            hiddenStops,
            hiddenRoutes,
            hashedState,
        })
        this.props.history.push(`/admin/${this.state.positionString}/${hashedState}`)
    }

    getStyle = (id, type) => {
        const { hiddenStops, hiddenStations, hiddenRoutes } = this.state
        if (type === 'stations') {
            const onStyle = !hiddenStations.includes(id)
            return onStyle ? null : { opacity: 0.3 }
        }
        if (type === 'stops') {
            const onStyle = !hiddenStops.includes(id)
            return onStyle ? null : { opacity: 0.3 }
        }
        const onStyle = !hiddenRoutes.includes(id)
        return onStyle ? null : { opacity: 0.3 }
    }

    handleTextInputChange = (event) => {
        const minutes = event.target.value
        const distance = minutes === '' ? null : minutesToDistance(minutes)
        const { position } = this.state
        this.setState({ distance })
        if (minutes.length) {
            this.updateSearch(distance, position)
        }
    }

    handleSliderChange = (event) => {
        const distance = minutesToDistance(event.target.value)
        const { position } = this.state
        this.setState({ distance })
        this.updateSearch(distance, position)
    }

    render() {
        const { distance, stations, stops } = this.state
        return (
            <div className="admin-container">
                <div className="admin-header">
                    <h1>Rediger innhold</h1>
                    <button className="close-button" onClick={this.goToDashboard}>X</button>
                </div>
                <div className="admin-content">
                    <SortPanel distance={distance} handleSliderChange={this.handleSliderChange} handleTextInputChange={this.handleTextInputChange}/>
                    <div className="places-container">
                        <div className="stations-container">
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
                                        }) => (
                                            <tr style={this.getStyle(id, 'stations')} key={id}>
                                                <td>{getIcon('bike')}</td>
                                                <td>{name}</td>
                                                <td>
                                                    <button onClick={() => this.updateHiddenList(id, 'stations')}>X</button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="stops-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Fjern busstopp</th>
                                    </tr>
                                </thead>
                                {
                                    stops.map(({
                                        name, id, transportMode, departures,
                                    }) => (
                                        <tbody key={id}>
                                            <tr style={this.getStyle(id, 'stops')} >
                                                <td>{getIcon(transportMode)}</td>
                                                <td>{name}</td>
                                                <td>
                                                    <button onClick={() => this.updateHiddenList(id, 'stops')}>X</button>
                                                </td>
                                            </tr>
                                            { departures.map(({ route, type }, index) => (
                                                <tr style={this.getStyle(route, 'routes')} key={index}>
                                                    <td>{getIcon(type)}</td>
                                                    <td>{route}</td>
                                                    <td>
                                                        <button onClick={() => this.updateHiddenList(route, 'routes')}>X</button>
                                                    </td>
                                                </tr>))}
                                        </tbody>
                                    ))
                                }
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AdminPage
