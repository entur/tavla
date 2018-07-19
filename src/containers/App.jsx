import React from 'react'
import LandingPage from './landingPage/LandingPage'

class App extends React.Component {
    addLocation = () => {
        navigator.geolocation.getCurrentPosition(data => {
            const position = { lat: data.coords.latitude, lon: data.coords.longitude }
            this.goToDepartureBoard(position)
        })
    }

    goToDepartureBoard(position) {
        const pos = (`${position.lat},${position.lon}`).split('.').join('-')
        this.props.history.push(`/dashboard/@${pos}/`)
    }

    render() {
        return (
            <LandingPage props={this.addLocation} />
        )
    }
}


export default App
