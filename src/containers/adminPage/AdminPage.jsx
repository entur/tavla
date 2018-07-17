import React from 'react'
import EnturService from '@entur/sdk'
import { getIcon, getPositionFromUrl, getSettingsFromUrl } from '../../utils'
import './styles.css'

const service = new EnturService()


class AdminPage extends React.Component {
    myStorage = window.localStorage

    state = {
        distance: 500,
        stations: [],
        hiddenSet: [],
        position: {},
        positionString: '',
        hashedState: '',
    }

    componentDidMount() {
        const position = getPositionFromUrl()
        const positionString = window.location.pathname.split('/')[2]
        const { hiddenSet, distance } = getSettingsFromUrl()
        service.getBikeRentalStations(position, distance).then(stations => {
            this.setState({
                stations,
            })
        })
        const hashedState = window.location.pathname.split('/')[3]
        this.setState({
            distance,
            hashedState,
            hiddenSet,
            position,
            positionString,
        })
    }

    handleChange = (event) => {
        const distance = event.target.value
        service.getBikeRentalStations(this.state.position, distance).then(stations => {
            this.setState({
                stations,
                distance,
            })
        })
        event.preventDefault()
    }

    handleSubmit = (event) => {
        const { distance, hiddenSet, positionString } = this.state
        const savedSettings = {
            distance,
            hiddenSet,
        }
        const hashedState = btoa(JSON.stringify(savedSettings))
        this.setState({ hashedState })
        this.props.history.push(`/admin/${positionString}/${hashedState}`)
        event.preventDefault()
    }

    removeStation = (clickedId) => {
        const { hiddenSet, positionString, distance } = this.state
        let newSet = hiddenSet
        if (hiddenSet.includes(clickedId)) {
            newSet = newSet.filter((id) => id !== clickedId)
        }
        else {
            newSet.push(clickedId)
        }
        const savedSettings = {
            distance,
            hiddenSet: newSet,
        }
        const hashedState = btoa(JSON.stringify(savedSettings))
        this.setState({
            hiddenSet: newSet,
            hashedState,
        })
        this.props.history.push(`/admin/${positionString}/${hashedState}`)
    }

    getStyle = (id) => {
        const onStyle = !this.state.hiddenSet.includes(id)
        return onStyle ? null : { opacity: 0.3 }
    }

    onHomeButton = (event) => {
        const { hashedState, positionString } = this.state
        this.props.history.replace(`/dashboard/${positionString}/${hashedState}`)
        event.preventDefault()
    }

    render() {
        const { distance, stations } = this.state
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
                                <th className="time">Fjern sykkelstasjon</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                stations.map(({
                                    name, id,
                                }) => {
                                    return (
                                        <tr className="row" style={this.getStyle(id)} key={id}>
                                            <td className="type">{getIcon('bike')}</td>
                                            <td className="name">{name}</td>
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
            </div>
        )
    }
}

export default AdminPage
