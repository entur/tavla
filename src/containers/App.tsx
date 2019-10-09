import React, { useCallback } from 'react'
import { Coordinates } from '@entur/sdk'

import LandingPage from './landingPage/LandingPage'

const App = ({ history }: Props): JSX.Element => {
    const addLocation = useCallback((position: Coordinates): void => {
        const pos = `${position.latitude},${position.longitude}`.split('.').join('-')
        history.push(`/dashboard/@${pos}/`)
    }, [history])

    return <LandingPage addLocation={addLocation} />
}

interface Props {
    history: any,
}

export default App
