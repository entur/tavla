import React from 'react'
import classNames from 'classnames'
import { EnturLogo } from '../../assets/icons/EnturLogo'
import { useSettings } from '../../settings/SettingsProvider'
import { LastUpdated } from './components/LastUpdated/LastUpdated'
import { BusTile } from './components/BusTile/BusTile'
import { CarTile } from './components/CarTile/CarTile'
import { PosterFooter } from './components/PosterFooter/PosterFooter'
import { ScooterTile } from './components/ScooterTile/ScooterTile'
import { BikeTile } from './components/BikeTile/BikeTile'
import './Poster.scss'

const Poster = (): JSX.Element => {
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
                {hideBusTile ? <></> : <BusTile />}
                <div
                    className={classNames({
                        'poster-mobility-tiles-wrapper': true,
                        'poster-mobility-tiles-wrapper--listed': hideBusTile,
                    })}
                >
                    <BikeTile />
                    <ScooterTile />
                    <CarTile />
                </div>
            </div>
            <PosterFooter />
        </div>
    )
}

export { Poster }
