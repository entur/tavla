import React from 'react'
import EnturService from '@entur/sdk'
import debounce from 'lodash.debounce'
import SelectionPanel from './SelectionPanel'
import {
    getPositionFromUrl,
    getSettingsFromUrl,
    getStopsWithUniqueStopPlaceDepartures,
    getStopPlacesByPositionAndDistance,
    getSettingsHash,
    updateHiddenListAndHash,
} from '../../utils'
import './styles.scss'

const service = new EnturService({ clientName: 'entur-tavla' })


class AdminPage extends React.Component {
    state = {
        distance: 300,
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

    handleChange = (event) => {
        const distance = event.target.value
        const { position } = this.state
        this.setState({ distance })
        this.updateSearch(distance, position)
    }

    updateSearch = debounce((distance, position) => {
        this.getDataFromSDK(position, distance)
    }, 500)

    handleSubmit = (event) => {
        const {
            distance, hiddenStations, hiddenStops, positionString, hiddenRoutes,
        } = this.state
        const hashedState = getSettingsHash(distance, hiddenStations, hiddenStops, hiddenRoutes)
        this.setState({ hashedState })
        this.props.history.push(`/admin/${positionString}/${hashedState}`)
        event.preventDefault()
    }

    updateHiddenList = (clickedId, hiddenListType) => {
        const {
            hiddenLists, hashedState,
        } = updateHiddenListAndHash(clickedId, this.state, hiddenListType)
        const { hiddenStations, hiddenStops, hiddenRoutes } = hiddenLists
        this.setState({
            hiddenStations,
            hiddenStops,
            hiddenRoutes,
            hashedState,
        })
        this.props.history.push(`/admin/${this.state.positionString}/${hashedState}`)
    }

    getStyle = (isHidden) => {
        return isHidden ? null : { opacity: 0.3 }
    }

    isHidden = (id, type) => {
        const { hiddenStops, hiddenStations, hiddenRoutes } = this.state
        if (type === 'stations') {
            return hiddenStations.includes(id)
        }
        if (type === 'stops') {
            return hiddenStops.includes(id)
        }
        return hiddenRoutes.includes(id)
    }

    onHomeButton = (event) => {
        const { hashedState, positionString } = this.state
        this.props.history.replace(`/dashboard/${positionString}/${hashedState}`)
        event.preventDefault()
    }

    render() {
        const { distance, stations, stops } = this.state
        const { isHidden, updateHiddenList } = this
        return (
            <div className="admin-content" >
                <div className="admin-header">
                    <h1>Admin</h1>
                    <button className="close-button" onClick={(event) => this.onHomeButton(event)}>X</button>
                </div>
                <div className="distance" >
                    <p>{distance} meter</p>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Distance:
                            <input
                                id="typeinp"
                                type="range"
                                min="200"
                                max="3000"
                                defaultValue="300"
                                step="100"
                                onChange={this.handleChange}
                            />
                        </label>
                        <button type="submit" value="Submit">Update</button>
                    </form>
                </div>

                <div className="stop-place-panel">
                    <SelectionPanel
                        stops={stops}
                        stations={stations}
                        updateHiddenList={updateHiddenList}
                        onCheck={isHidden}
                    />
                </div>
            </div>
        )
    }
}

export default AdminPage
