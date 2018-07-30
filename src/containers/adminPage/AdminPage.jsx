import React from 'react'
import EnturService from '@entur/sdk'
import debounce from 'lodash.debounce'
import SelectionPanel from './SelectionPanel'
import FilterPanel from './FilterPanel'
import {
    getPositionFromUrl,
    getSettingsFromUrl,
    getStopsWithUniqueStopPlaceDepartures,
    getStopPlacesByPositionAndDistance,
    getSettingsHash,
    updateHiddenListAndHash,
    minutesToDistance,
    getTransportModesByStop,
} from '../../utils'
import { DEFAULT_DISTANCE } from '../../constants'
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
        hiddenModes: [],
        position: {},
        positionString: '',
        hashedState: '',
        transportModes: [],
    }

    componentDidMount() {
        const position = getPositionFromUrl()
        const positionString = window.location.pathname.split('/')[2]
        const {
            hiddenStations, hiddenStops, distance, hiddenRoutes, hiddenModes,
        } = getSettingsFromUrl()
        this.getDataFromSDK(position, distance)
        const hashedState = window.location.pathname.split('/')[3]
        this.setState({
            distance,
            hashedState,
            hiddenStops,
            hiddenStations,
            hiddenRoutes,
            hiddenModes,
            position,
            positionString,
        })
    }

    getDataFromSDK(position, distance) {
        service.getBikeRentalStations(position, distance).then(stations => {
            if (this.state.hiddenModes.includes('bike')) {
                this.setState({
                    stations: [],
                    transportModes: ['bike'],
                })
            } else {
                this.setState({
                    stations,
                    transportModes: ['bike'],
                })
            }
        })
        getStopPlacesByPositionAndDistance(position, distance).then(stops => {
            getStopsWithUniqueStopPlaceDepartures(stops).then((uniqueRoutes) => {
                const uniqueModes = getTransportModesByStop(uniqueRoutes)
                const filterStops = uniqueRoutes.map((stop) => {
                    const filterStop = stop.departures.filter(({ type }) => !this.state.hiddenModes.includes(type))
                    if (filterStop.length > 0) {
                        return {
                            ...stop,
                            departures: filterStop,
                        }
                    }
                }).filter(Boolean)

                uniqueModes.map((mode) => {
                    this.setState({
                        stops: filterStops,
                        transportModes: [
                            ...this.state.transportModes,
                            mode,
                        ],
                    })
                })
            })
        })
    }

    updateSearch = debounce((distance, position) => {
        this.getDataFromSDK(position, distance)
    }, 500)

    goToDashboard = () => {
        const {
            distance, hiddenStations, hiddenStops, positionString, hiddenRoutes, hiddenModes,
        } = this.state
        const hashedState = getSettingsHash(distance, hiddenStations, hiddenStops, hiddenRoutes, hiddenModes)
        this.setState({ hashedState })
        this.props.history.push(`/dashboard/${positionString}/${hashedState}`)
    }

    updateHiddenList = (clickedId, hiddenListType) => {
        const {
            hiddenLists, hashedState,
        } = updateHiddenListAndHash(clickedId, this.state, hiddenListType)
        const {
            hiddenStations, hiddenStops, hiddenRoutes, hiddenModes,
        } = hiddenLists
        this.setState({
            hiddenStations,
            hiddenStops,
            hiddenRoutes,
            hiddenModes,
            hashedState,
        })

        const { position, distance } = this.state
        if (hiddenListType === 'transportModes') {
            this.getDataFromSDK(position, distance)
        }

        this.props.history.push(`/admin/${this.state.positionString}/${hashedState}`)
    }

    getStyle = (isHidden) => {
        return isHidden ? null : { opacity: 0.3 }
    }

    isHidden = (id, type) => {
        const {
            hiddenStops, hiddenStations, hiddenRoutes, hiddenModes,
        } = this.state
        if (type === 'stations') {
            return hiddenStations.includes(id)
        }
        if (type === 'stops') {
            return hiddenStops.includes(id)
        }

        if (type === 'modes') {
            return hiddenModes.includes(id)
        }
        return hiddenRoutes.includes(id)
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
        const {
            distance, stations, stops, transportModes,
        } = this.state
        const { isHidden, updateHiddenList } = this
        return (
            <div className="admin-container">
                <div className="admin-header">
                    <h1>Rediger innhold</h1>
                    <button className="close-button" onClick={this.goToDashboard}>X</button>
                </div>
                <div className="admin-content">
                    <FilterPanel
                        isHidden={isHidden}
                        transportModes={transportModes}
                        distance={distance}
                        handleSliderChange={this.handleSliderChange}
                        handleTextInputChange={this.handleTextInputChange}
                        updateHiddenList={this.updateHiddenList}
                        getStyle={this.getStyle}
                    />
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
