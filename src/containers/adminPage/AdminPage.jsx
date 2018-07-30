import React from 'react'
import EnturService from '@entur/sdk'
import debounce from 'lodash.debounce'
import { SortPanel } from '../../components'
import SelectionPanel from './SelectionPanel'
import {
    getPositionFromUrl,
    getSettingsFromUrl,
    getStopsWithUniqueStopPlaceDepartures,
    getStopPlacesByPositionAndDistance,
    getSettingsHash,
    updateHiddenListAndHash,
    minutesToDistance,
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
        const { isHidden, updateHiddenList } = this
        return (
            <div className="admin-container">
                <div className="admin-header">
                    <h1>Rediger innhold</h1>
                    <button className="close-button" onClick={this.goToDashboard}>Oppdater</button>
                </div>
                <div className="admin-content">
                    <SortPanel distance={distance} handleSliderChange={this.handleSliderChange} handleTextInputChange={this.handleTextInputChange}/>
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
