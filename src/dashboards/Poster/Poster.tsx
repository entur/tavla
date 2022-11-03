import React from 'react'
import classNames from 'classnames'
import { EnturLogo } from '../../assets/icons/EnturLogo'
import { useSettings } from '../../settings/SettingsProvider'
import { Direction } from '../../types'
import { useReloadTavleOnUpdate } from '../../hooks/useReloadTavleOnUpdate'
import { LastUpdated } from './components/LastUpdated/LastUpdated'
import { BusTile } from './components/BusTile/BusTile'
import { CarTile } from './components/CarTile/CarTile'
import { PosterFooter } from './components/PosterFooter/PosterFooter'
import { ScooterTile } from './components/ScooterTile/ScooterTile'
import { BikeTile } from './components/BikeTile/BikeTile'
import './Poster.scss'

const Poster = (): JSX.Element => {
    useReloadTavleOnUpdate()
    const [settings] = useSettings()
    const { hiddenModes } = settings || {}

    const hideBusTile = hiddenModes?.includes('kollektiv')
    const hideScooterTile = hiddenModes?.includes('sparkesykkel')
    const hideBikeTile = hiddenModes?.includes('bysykkel')
    const hideCarTile = hiddenModes?.includes('delebil')
    const isRotated = settings.direction === Direction.ROTATED

    return (
        <div
            className={classNames('poster', {
                'poster--rotated': isRotated,
            })}
        >
            <div className="poster-header">
                <EnturLogo className="poster-header-logo" />
            </div>
            <div className="poster-content-wrapper">
                <div className="poster-heading-wrapper">
                    <h1 className="poster-heading">Skal du videre?</h1>
                    <LastUpdated />
                </div>
                {hideBusTile ? null : <BusTile />}
                <div
                    className={classNames({
                        'poster-mobility-tiles-wrapper': true,
                        'poster-mobility-tiles-wrapper--listed': hideBusTile,
                    })}
                >
                    {hideBikeTile ? null : <BikeTile />}
                    {hideScooterTile ? null : <ScooterTile />}
                    {hideCarTile ? null : <CarTile />}
                </div>
            </div>
            <PosterFooter />
        </div>
    )
}

export { Poster }
