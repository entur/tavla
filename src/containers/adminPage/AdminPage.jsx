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
    getUniqueRoutes,
    transformDepartureToLineData,
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
        initialLoading: true,
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
    }

    getDataFromSDK(position, distance) {
        const { newStations } = getSettingsFromUrl()

        Promise.all(newStations.map(stationId => {
            return service.getBikeRentalStation(stationId)
        }))
            .then(hashedStationsData => {
                service.getBikeRentalStations(position, distance).then(stations => {
                    const allStations = sortLists(hashedStationsData, stations)

                    let transportModes = []
                    if (allStations.length > 0) {
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
                            stations: allStations,
                            transportModes,
                        })
                    }
                })
            })

        getStopPlacesByPositionAndDistance(position, distance).then(stops => {
            const { newStops } = getSettingsFromUrl()
            const hashedStops = newStops.map(stopId => {
                return service.getStopPlace(stopId).then(stop => {
                    return service.getStopPlaceDepartures(stopId, { onForBoarding: true, departures: 50 })
                        .then(departures => {
                            return {
                                ...stop,
                                departures: getUniqueRoutes(departures.map(transformDepartureToLineData)),
                            }
                        })
                })
            })

            Promise.all(hashedStops).then(hashedStopsData => {
                const allStops = sortLists(hashedStopsData, stops)

                getStopsWithUniqueStopPlaceDepartures(allStops).then((uniqueRoutes) => {
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

                    this.setState({
                        stops: filterStops,
                        transportModes: [ ...new Set([
                            ...this.state.transportModes,
                            ...uniqueModes,
                        ])],
                    })
                })
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

    updateHiddenListForAll = (checked, type) => {
        switch (type) {
            case 'stops':
                const stopIds = this.state.stops.map(stop => stop.id)
                const hiddenStops = !checked ? stopIds : []
                this.setState({
                    hiddenStops,
                })
                break
            case 'stations':
                const stationIds = this.state.stations.map(station => station.id)
                const hiddenStations = !checked ? stationIds : []
                this.setState({
                    hiddenStations,
                })
                break
        }
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

    handleAddNewStation = (stations) => {
        const stationIds = stations
            .filter(station => this.state.stations.every(item => item.name !== station.name))
            .map(station => station.id)

        if (!stationIds.length) return

        const { newStations } = getSettingsFromUrl()

        const updatedNewStations = sortLists(newStations, stationIds)
        const updatedStations = sortLists(this.state.stations, stations)

        const {
            distance, hiddenStations, hiddenStops, positionString,
            hiddenRoutes, hiddenModes, newStops,
        } = this.state

        const hashedState = getSettingsHash(distance, hiddenStations, hiddenStops, hiddenRoutes, hiddenModes, updatedNewStations, newStops)

        this.setState({
            hashedState,
            stations: updatedStations,
            newStations: updatedNewStations,
        })

        this.props.history.push(`/admin/${positionString}/${hashedState}`)
    }

    handleAddNewStop = (newStop) => {
        const found = this.state.stops.some(item => item.id === newStop.id)
        const hasDepartures = !(newStop.departures.length === 0)

        if (found || !hasDepartures) return

        getStopsWithUniqueStopPlaceDepartures([newStop]).then(stop => {
            const {
                distance, hiddenStations, hiddenStops, positionString,
                hiddenRoutes, hiddenModes, newStations, stops,
            } = this.state

            const { newStops } = getSettingsFromUrl()

            const updatedNewStops = sortLists(newStops, [newStop.id])
            const hashedState = getSettingsHash(distance, hiddenStations, hiddenStops, hiddenRoutes, hiddenModes, newStations, updatedNewStops)

            const updatedStops = sortLists(stops, stop)
            this.setState({
                stops: updatedStops,
                newStops: updatedNewStops,
                hashedState,
            })
            this.props.history.push(`/admin/${positionString}/${hashedState}`)
        })
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
                        updateHiddenListForAll={this.updateHiddenListForAll}
                        position={position}
                        onCheck={isHidden}
                        handleAddNewStop={this.handleAddNewStop}
                    />
                    <BikePanel
                        stations={stations}
                        updateHiddenList={updateHiddenList}
                        updateHiddenListForAll={this.updateHiddenListForAll}
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
