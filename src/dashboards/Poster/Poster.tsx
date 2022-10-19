import React, { useEffect, useState } from 'react'
import { FormFactor } from '@entur/sdk/lib/mobility/types'
import { useBikeRentalStations, useMobility } from '../../logic'
import { EnturLogo } from '../../assets/icons/EnturLogo'
import { useSettings } from '../../settings/SettingsProvider'
import { Mode } from '../../settings'
import './Poster.scss'
import { LastUpdated } from './components/LastUpdated/LastUpdated'
import { BusTile } from './components/BusTile/BusTile'
import { CarTile } from './components/CarTile/CarTile'
import { PosterFooter } from './components/PosterFooter/PosterFooter'
import { ScooterTile } from './components/ScooterTile/ScooterTile'

const Poster = (): JSX.Element => {
    const bikeRentalStations = useBikeRentalStations()
    const [totalNumberOfBikes, setTotalNumberOfBikes] = useState(0)
    const totalNumberOfScooters = useMobility(FormFactor.SCOOTER)?.length || 0
    const [settings, setSettings] = useSettings()
    const initialMobility: Mode[] = [
        'bysykkel',
        'kollektiv',
        'sparkesykkel',
        'delebil',
    ]

    const mobilityPicker = initialMobility.filter(
        (mob) => !settings?.hiddenModes.includes(mob),
    )
    
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
                    <h1 className="poster-heading">Skal du videre?</h1>
                    <LastUpdated />
                </div>
                <div className="poster-next-bus">Neste buss</div>
                <BusTile />

                <div className="poster-mobility-tiles-wrapper">
                    {/* Todo: change this to use biketile and style */}
                    { settings?.hiddenModes.includes('delebil') ? (
                        <></>
                    ) : (
                        <div className="poster-mobility-tile">
                            <div className="poster-mobility-description">
                                <h2 className="poster-mobility-description-heading">
                                    Delebil
                                </h2>
                                <h3 className="poster-mobility-description-area">
                                    P-plassen ved Vestveien
                                </h3>
                            </div>
                            <div className="poster-mobility-vehicles-box">
                                <CarTile numberOfCars={totalNumberOfBikes} />
                            </div>
                        </div>
                    )}
                    {settings?.hiddenModes.includes('sparkesykkel') ? (
                        <></>
                    ) : (
                        <div className="poster-mobility-tile">
                            <div className="poster-mobility-description">
                                <h2 className="poster-mobility-description-heading">
                                    Elsparkesykler
                                </h2>
                                <h3 className="poster-mobility-description-area">
                                    Innen 200 meters radius
                                </h3>
                            </div>
                            <div className="poster-mobility-vehicles-box">
                                <ScooterTile
                                    numberOfScooters={totalNumberOfScooters}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <PosterFooter />
        </div>
    )
}

export { Poster }
