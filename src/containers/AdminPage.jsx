import React from 'react'
import Logo from '../components/icons/logo'


class AdminPage extends React.Component {
    myStorage = window.localStorage

    state = {
        distance: 500,
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

    componentDidMount() {
        navigator.geolocation.getCurrentPosition((position) => {
            const latlong = { lat: position.coords.latitude, long: position.coords.longitude }
            this.myStorage.setItem('latlong', JSON.stringify(latlong))
        })
    }

    render() {
        const { distance } = this.state
        return (
            <div>
                <h1>Admin</h1>
                {distance} meter
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Distance:
                        <input id="typeinp" type="range" min="0" max="5000" defaultValue="500" step="100" onChange={this.handleChange}/>
                    </label>
                    <button type="submit" value="Submit">Update</button>
                </form>
                <Logo />
            </div>
        )
    }
}

export default AdminPage
