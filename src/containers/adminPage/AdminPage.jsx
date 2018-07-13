import React from 'react'
import { getIcon } from '../../utils'
import './styles.css'

class AdminPage extends React.Component {
    myStorage = window.localStorage

    state = {
        distance: 500,
        stations: [],
        visibleSet: [],
    }

    componentDidMount() {
        const stations = JSON.parse(this.myStorage.stations)
        const visibleSet = stations.map((station) => (station.id))
        this.setState({
            stations,
            visibleSet,
        })
    }

    handleChange = event => {
        const distance = event.target.value
        this.setState({
            distance,
        })
        this.myStorage.setItem('config', distance)
        event.preventDefault()
    }

    handleSubmit = (event) => {
        const { distance } = this.state
        this.myStorage.setItem('config', distance)
        event.preventDefault()
    }

    removeStation = (clickedId) => {
        const { visibleSet } = this.state
        let newSet = visibleSet
        if (visibleSet.includes(clickedId)) {
            newSet = newSet.filter((id) => id !== clickedId)
        }
        else {
            newSet.push(clickedId)
        }
        this.setState({
            visibleSet: newSet,
        })
    }

    getStyle = (id) => {
        const onStyle = this.state.visibleSet.includes(id)
        return onStyle ? null : { opacity: 0.3 }
    }

    render() {
        const { distance, stations, visibleSet } = this.state
        return (
            <div className="adminContent" >
                <div className="distance" >
                    <h1>Admin</h1>
                    <p>{distance} meter</p>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Distance:
                            <input id="typeinp" type="range" min="0" max="5000" defaultValue="500" step="100" onChange={this.handleChange}/>
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
