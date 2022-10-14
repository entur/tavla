import React, { useEffect, useState } from 'react'
import { useBikeRentalStations } from '../../logic'
import { EnturLogo } from '../../assets/icons/EnturLogo'
import './Poster.scss'
import { LastUpdated } from './components/LastUpdated/LastUpdated'
import { BusTile } from './components/BusTile/BusTile'
import { CarTile } from './components/CarTile/CarTile'
import { Footer } from './components/Footer/Footer'
import { ScooterTile } from './components/ScooterTile/ScooterTile'
import { BikeTile } from '../Chrono/BikeTile/BikeTile'

const Poster = (): JSX.Element => {
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
        <div className="poster-wrapper">
            <div className="poster-content-wrapper">
                <div className="poster-header">
                    <EnturLogo />
                </div>
                <div className="heading-wrapper">
                    <h1 className="poster-heading">I nærheten</h1>
                    <LastUpdated />
                </div>

                <div>
                    <BusTile />
                </div>

                <div className="mobility-tiles-wrapper">
                    {/* Todo: change this to use biketile and style */}
                    <div className="poster-vehicle-tile">
                        <CarTile numberOfCars={totalNumberOfBikes} />
                        <div className="vehicles-description">
                            <h2 className="vehicles-description-heading">
                                Delebil
                            </h2>
                            <h3 className="vehicles-description-area">
                                Parkeringsplassen ved Vestveien
                            </h3>
                        </div>
                    </div>
                    <div className="poster-vehicle-tile">
                        <ScooterTile numberOfScooters={20} />
                        <div className="vehicles-description">
                            <h2 className="vehicles-description-heading">
                                Elsparkesykler
                            </h2>
                            <h3 className="vehicles-description-area">
                                Innen 500 meters radius
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export { Poster }
