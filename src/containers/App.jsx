import React from 'react'
import LandingPage from './landingPage/LandingPage'

class App extends React.Component {
    addLocation = (position) => {
        this.goToDepartureBoard(position)
    }

    goToDepartureBoard(position) {
        const pos = (`${position.lat},${position.lon}`).split('.').join('-')
        this.props.history.push(`/dashboard/@${pos}/`)
    }

    render() {
        return (
            <LandingPage addLocation={this.addLocation}/>
        )
    }
}


export default App
