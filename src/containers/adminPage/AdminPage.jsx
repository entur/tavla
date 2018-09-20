import React from 'react'
import debounce from 'lodash.debounce'
import SelectionPanel from './SelectionPanel'
import BikePanel from './BikePanel'
import FilterPanel from './filterPanel/FilterPanel'
import {
    getPositionFromUrl,
    getSettingsFromUrl,
    getStopsWithUniqueStopPlaceDepartures,
    getStopPlacesByPositionAndDistance,
    getSettingsHash,
    updateHiddenListAndHash,
    getTransportModesByStop,
    sortLists,
} from '../../utils'
import { DEFAULT_DISTANCE } from '../../constants'
import service from '../../service'
import AdminHeader from './AdminHeader'

import './styles.scss'

class AdminPage extends React.Component {
    state = {
        distance: DEFAULT_DISTANCE,
        stations: [],
        stops: [],
        newStations: [],
        newStops: [],
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
            newStations, newStops,
        } = getSettingsFromUrl()
        this.getDataFromSDK(position, distance)
        const hashedState = window.location.pathname.split('/')[3]
        this.setState({
            newStations,
            newStops,
            distance,
            hashedState,
            hiddenStops,
            hiddenStations,
            hiddenRoutes,
            hiddenModes,
            position,
            positionString,
        })
        this.getHashedBikeStations(newStations)
        this.getHashedStops(newStops)
    }

    getHashedBikeStations = (stations) => {
        return stations.forEach(stationId => {
            service.getBikeRentalStation(stationId).then(station => {
                const allStations = sortLists(this.state.stations, [station])
                this.setState({
                    stations: allStations,
                })
            })
        })
    }

    getHashedStops = (newStops) => {
        return newStops.forEach(stopId => {
            service.getStopPlace(stopId).then(stop => {
                service.getStopPlaceDepartures(stopId, { onForBoarding: true, departures: 50 })
                    .then(departures => {
                        const updatedStop = {
                            ...stop,
                            departures,
                        }
                        const allStops = sortLists(this.state.stops, updatedStop)
                        this.setState({
                            stops: allStops,
                        })
                    })
            })
        })
    }

    getDataFromSDK(position, distance) {
        service.getBikeRentalStations(position, distance).then(stations => {
            let transportModes = []
            if (stations.length > 0) {
                transportModes = this.state.transportModes.includes('bike') ? this.state.transportModes : ['bike', ...this.state.transportModes]
            } else {
                transportModes = this.state.transportModes
            }
            if (this.state.hiddenModes.includes('bike')) {
                this.setState({
                    stations: [],
                    transportModes,
                })
            } else {
                this.setState({
                    stations,
                    transportModes,
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

                this.setState(prevState => ({
                    stops: sortLists(prevState.stops, filterStops),
                    transportModes: [ ...new Set([
                        ...this.state.transportModes,
                        ...uniqueModes,
                    ])],
                }))
            })
        })
    }

    updateSearch = debounce((distance, position) => {
        this.getDataFromSDK(position, distance)
    }, 500)

    updateAndGoToDashboard = () => {
        const {
            distance, hiddenStations, hiddenStops, positionString, hiddenRoutes, hiddenModes,
        } = this.state
        const { newStations, newStops } = getSettingsFromUrl()

        const hashedState = getSettingsHash(distance, hiddenStations, hiddenStops, hiddenRoutes, hiddenModes, newStations, newStops)

        this.setState({ hashedState })
        this.props.history.push(`/dashboard/${positionString}/${hashedState}`)
    }

    goBackToDashboard = () => {
        this.props.history.push(window.location.pathname.replace('admin', 'dashboard'))
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
        const distance = event.target.value
        const { position } = this.state
        this.setState({ distance })
        if (distance.length) {
            this.updateSearch(distance, position)
        }
    }

    handleSliderChange = (event) => {
        const distance = event.target.value
        const { position } = this.state
        this.setState({ distance })
        this.updateSearch(distance, position)
    }

    addDeparturesToStop = (stop) => {
        service.getStopPlaceDepartures(stop.id, { onForBoarding: true, departures: 50 })
            .then(departures => {
                const updatedStop = {
                    ...stop,
                    departures,
                }
                const allStops = sortLists(this.state.stops, updatedStop)
                this.setState({
                    stops: allStops,
                })
            })
    }

    handleAddNewStation = (newStations) => {
        const stationIds = newStations.map(station => {
            const found = this.state.stations.find(item => item.name === station.name)
            if (!found) return station.id
        }).filter(Boolean)

        if (!stationIds.length) return

        const sortedStationIds = sortLists(this.state.newStations, stationIds)
        const updatedStations = sortLists(this.state.stations, newStations)

        const {
            distance, hiddenStations, hiddenStops, positionString,
            hiddenRoutes, hiddenModes, newStops,
        } = this.state

        const hashedState = getSettingsHash(distance, hiddenStations, hiddenStops, hiddenRoutes, hiddenModes, sortedStationIds, newStops)

        this.setState({
            hashedState,
            stations: updatedStations,
            newStations: sortedStationIds,
        })
        this.props.history.push(`/admin/${positionString}/${hashedState}`)
    }

    handleAddNewStop = (newStop) => {
        const found = this.state.stops.map(item => item.id === newStop.id).includes(true)
        const hasDepartures = !(newStop.departures.length === 0)

        if (!found && hasDepartures) {
            const {
                distance, hiddenStations, hiddenStops, positionString, hiddenRoutes, hiddenModes,
                newStations, newStops, stops,
            } = this.state

            const sortedStopIds = sortLists(newStops, [newStop.id])
            const sortedStops = sortLists(stops, newStop)

            const hashedState = getSettingsHash(distance, hiddenStations, hiddenStops, hiddenRoutes, hiddenModes, newStations, sortedStopIds)
            this.setState({
                hashedState,
                stops: sortedStops,
                newStops: sortedStopIds,
            })

            this.props.history.push(`/admin/${positionString}/${hashedState}`)
        }
    }

    render() {
        const {
            distance, stations, stops, transportModes, hiddenModes, position,
        } = this.state
        const { isHidden, updateHiddenList } = this
        return (
            <div className="admin-container">
                <AdminHeader
                    goBackToDashboard={this.goBackToDashboard}
                />
                <div className="admin-content">
                    <FilterPanel
                        isHidden={isHidden}
                        transportModes={transportModes}
                        distance={distance}
                        handleSliderChange={this.handleSliderChange}
                        handleTextInputChange={this.handleTextInputChange}
                        updateHiddenList={this.updateHiddenList}
                        getStyle={this.getStyle}
                        hiddenModes={hiddenModes}
                    />
                    <SelectionPanel
                        stops={stops}
                        stations={stations}
                        updateHiddenList={updateHiddenList}
                        position={position}
                        onCheck={isHidden}
                        handleAddNewStop={this.handleAddNewStop}
                    />
                    <BikePanel
                        stations={stations}
                        updateHiddenList={updateHiddenList}
                        onCheck={isHidden}
                        position={position}
                        handleAddNewStation={this.handleAddNewStation}
                    />
                </div>
                <div className="update-button-container">
                    <button className="update-button" onClick={this.updateAndGoToDashboard}>
                            Oppdater tavle
                    </button>
                </div>
            </div>
        )
    }
}

export default AdminPage
