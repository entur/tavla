import React, { useEffect, useState } from 'react'

import { useBikeRentalStations } from '../../logic'

import Content from './Content'
import Footer from './Footer'
import Header from './Header'

import './styles.scss'

// note: classname wrapper kan skape problemer
const JCDecaux = (): JSX.Element | null => {
    const bikeRentalStations = useBikeRentalStations()
    const [totalNumberOfBikes, setTotalNumberOfBikes] = useState(0)
    useEffect(() => {
        const tempNumberOfBikes = bikeRentalStations?.reduce(
            (numberOfBikes, station) =>
                numberOfBikes + station.numBikesAvailable,
            0,
        )
        setTotalNumberOfBikes(tempNumberOfBikes || 0)
    }, [bikeRentalStations])

    return (
        <div className="wrapper">
            <Header />
            <Content numberOfBikes={totalNumberOfBikes} />
            <Footer />
        </div>
    )
}

export default JCDecaux
