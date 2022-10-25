import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { FormFactor } from '@entur/sdk/lib/mobility/types'
import { useRentalStations, useMobility } from '../../logic'
import { EnturLogo } from '../../assets/icons/EnturLogo'
import { useSettings } from '../../settings/SettingsProvider'
import './Poster.scss'
import { LastUpdated } from './components/LastUpdated/LastUpdated'
import { BusTile } from './components/BusTile/BusTile'
import { CarTile } from './components/CarTile/CarTile'
import { PosterFooter } from './components/PosterFooter/PosterFooter'
import { ScooterTile } from './components/ScooterTile/ScooterTile'

const Poster = (): JSX.Element => {
    const carRentalStations = useRentalStations(true, FormFactor.CAR)
    const [totalNumberOfCars, setTotalNumberOfCars] = useState(0)
    const totalNumberOfScooters = useMobility(FormFactor.SCOOTER)?.length || 0
    const [settings] = useSettings()

    useEffect(() => {
        const tempNumberOfCars = carRentalStations?.reduce(
            (numberOfCars, station) => numberOfCars + station.numBikesAvailable,
            0,
        )
        setTotalNumberOfCars(tempNumberOfCars || 0)
    }, [carRentalStations])

    return (
        <div className="poster">
            <div className="poster-header">
                <EnturLogo className="poster-header-logo" />
            </div>
            <div className="poster-content-wrapper">
                <div className="poster-heading-wrapper">
                    <h1 className="poster-heading">Skal du videre?</h1>
                    <LastUpdated />
                </div>

                {settings?.hiddenModes.includes('kollektiv') ? (
                    <></>
                ) : (
                    <>
                        <div className="poster-next-bus">Neste buss</div>
                        <BusTile />
                    </>
                )}
                <div
                    className={classNames({
                        'poster-mobility-tiles-wrapper': true,
                        'poster-mobility-tiles-wrapper--listed':
                            settings?.hiddenModes.includes('kollektiv'),
                    })}
                >
                    {settings?.hiddenModes.includes('delebil') ? (
                        <></>
                    ) : (
                        <div
                            className={classNames({
                                'poster-mobility-tile': true,
                                'poster-mobility-tile--listed':
                                    settings?.hiddenModes.includes('kollektiv'),
                            })}
                        >
                            <div className="poster-mobility-description">
                                <h2 className="poster-mobility-description-heading">
                                    Delebil
                                </h2>
                                <h3 className="poster-mobility-description-area">
                                    P-plassen ved Vestveien
                                </h3>
                            </div>
                            <div className="poster-mobility-vehicles-box">
                                <CarTile numberOfCars={totalNumberOfCars} />
                            </div>
                        </div>
                    )}
                    {settings?.hiddenModes.includes('sparkesykkel') ? (
                        <></>
                    ) : (
                        <div
                            className={classNames({
                                'poster-mobility-tile': true,
                                'poster-mobility-tile--listed':
                                    settings?.hiddenModes.includes('kollektiv'),
                            })}
                        >
                            <div className="poster-mobility-description">
                                <h2 className="poster-mobility-description-heading">
                                    Elsparkesykler
                                </h2>
                                <h3 className="poster-mobility-description-area">
                                    Innen {settings?.distance || 0} meters
                                    radius
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
