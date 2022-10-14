import React, { useEffect, useState } from 'react'
import { useBikeRentalStations } from '../../logic'
import { EnturLogo } from '../../assets/icons/EnturLogo'
import './Poster.scss'
import { LastUpdated } from './components/LastUpdated/LastUpdated'
import { BusTile } from './components/BusTile/BusTile'
import { CarTile } from './components/CarTile/CarTile'
import { PosterFooter } from './components/PosterFooter/PosterFooter'
import { ScooterTile } from './components/ScooterTile/ScooterTile'

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
        <div className="poster">
            <div className="poster-header">
                <EnturLogo />
            </div>
            <div className="poster-content-wrapper">
                <div className="poster-heading-wrapper">
                    <h1 className="poster-heading">I nærheten</h1>
                    <LastUpdated />
                </div>
                <div className="poster-next-bus">Neste buss</div>
                <BusTile />

                <div className="poster-mobility-tiles-wrapper">
                    {/* Todo: change this to use biketile and style */}
                    <div className="poster-mobility-tile">
                        <div className="poster-mobility-description">
                            <h2 className="poster-mobility-description-heading">
                                Delebil
                            </h2>
                            <h3 className="poster-mobility-description-area">
                                Parkeringsplassen ved Vestveien
                            </h3>
                        </div>
                        <div className="poster-mobility-vehicles-box">
                            <CarTile numberOfCars={totalNumberOfBikes} />
                        </div>
                    </div>
                    <div className="poster-mobility-tile">
                        <div className="poster-mobility-description">
                            <h2 className="poster-mobility-description-heading">
                                Elsparkesykler
                            </h2>
                            <h3 className="poster-mobility-description-area">
                                Innen 500 meters radius
                            </h3>
                        </div>
                        <div className="poster-mobility-vehicles-box">
                            <ScooterTile numberOfScooters={20} />
                        </div>
                    </div>
                </div>
            </div>
            <PosterFooter />
        </div>
    )
}

export { Poster }
