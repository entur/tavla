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

    goToPrivacy = () => {
        this.props.history.push('/privacy')
    }

    render() {
        return (
            <LandingPage addLocation={this.addLocation} goToPrivacy={ this.goToPrivacy }/>
        )
    }
}


export default App
