import React, { useMemo } from 'react'
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

    const totalNumberOfCars = useMemo(
        () =>
            carRentalStations?.reduce(
                (numberOfCars, station) =>
                    numberOfCars + station.numBikesAvailable,
                0,
            ),
        [carRentalStations],
    )

    const totalNumberOfScooters = useMobility(FormFactor.SCOOTER)?.length || 0
    const [settings] = useSettings()
    const hideBusTile = settings?.hiddenModes.includes('kollektiv')
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

                {hideBusTile ? (
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
                        'poster-mobility-tiles-wrapper--listed': hideBusTile,
                    })}
                >
                    {settings?.hiddenModes.includes('delebil') ? (
                        <></>
                    ) : (
                        <div
                            className={classNames({
                                'poster-mobility-tile': true,
                                'poster-mobility-tile--listed': hideBusTile,
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
                            <div
                                className={classNames({
                                    'poster-mobility-vehicles-box': true,
                                    'poster-mobility-vehicles-box--listed':
                                        hideBusTile,
                                })}
                            >
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
                                'poster-mobility-tile--listed': hideBusTile,
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
                            <div
                                className={classNames({
                                    'poster-mobility-vehicles-box': true,
                                    'poster-mobility-vehicles-box--listed':
                                        hideBusTile,
                                })}
                            >
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
