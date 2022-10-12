import React, { useEffect, useState } from 'react'
import { useBikeRentalStations } from '../../logic'
import { EnturLogo } from '../../assets/icons/EnturLogo'
import './JCDecaux.scss'
import { LastUpdated } from './components/LastUpdated/LastUpdated'
import { BusTile } from './components/BusTile/BusTile'
import { CarTile } from './components/CarTile/CarTile'
import { Footer } from './components/Footer/Footer'

const JCDecaux = (): JSX.Element => {
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
        <div className="jcdecaux-wrapper">
            <div className="jcdecaux-content-wrapper">
                <div className="jcdecaux-header">
                    <EnturLogo />
                </div>
                <div className="heading-wrapper">
                    <h1 className="JCD-heading">I nærheten</h1>
                    <LastUpdated />
                </div>

                <div>
                    <BusTile />
                </div>

                <div className="mobility-tiles-wrapper">
                    {/* Todo: change this to use biketile and style */}
                    <CarTile numberOfCars={totalNumberOfBikes} />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export { JCDecaux }
