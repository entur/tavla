import React from 'react'
import LandingPage from './landingPage/LandingPage'

const App = ({ history }) => {
    const goToDepartureBoard = position => {
        const pos = `${position.lat},${position.lon}`.split('.').join('-')
        history.push(`/dashboard/@${pos}/`)
    }

    const addLocation = position => {
        goToDepartureBoard(position)
    }

    return <LandingPage addLocation={addLocation} />
}

export default App
