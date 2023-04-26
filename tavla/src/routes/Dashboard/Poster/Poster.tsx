import React from 'react'
import classNames from 'classnames'
import { EnturLogo } from 'assets/icons/EnturLogo'
import { useSettings } from 'settings/SettingsProvider'
import { useReloadTavleOnUpdate } from 'hooks/useReloadTavleOnUpdate'
import { LastUpdated } from './components/LastUpdated/LastUpdated'
import { BusTile } from './components/BusTile/BusTile'
import { CarTile } from './components/CarTile/CarTile'
import { PosterFooter } from './components/PosterFooter/PosterFooter'
import { ScooterTile } from './components/ScooterTile/ScooterTile'
import { BikeTile } from './components/BikeTile/BikeTile'
import classes from './Poster.module.scss'

function Poster() {
    useReloadTavleOnUpdate()
    const [settings] = useSettings()

    const hideBusTile = settings.hiddenModes.includes('kollektiv')
    const hideScooterTile = settings.hiddenModes.includes('sparkesykkel')
    const hideBikeTile = settings.hiddenModes.includes('bysykkel')
    const hideCarTile = settings.hiddenModes.includes('delebil')
    const isRotated = settings.direction === 'rotated'

    return (
        <div
            className={classNames({
                [classes.Rotated]: isRotated,
            })}
        >
            <div className={classes.Poster}>
                <div className={classes.Header}>
                    <EnturLogo className={classes.HeaderLogo} />
                </div>
                <div className={classes.Content}>
                    <div className={classes.HeadingWrapper}>
                        <h1 className={classes.Heading}>Skal du videre?</h1>
                        <LastUpdated />
                    </div>
                    {hideBusTile ? null : <BusTile />}
                    <div
                        className={classNames(classes.MobilityTiles, {
                            [classes.MobilityTilesList]: hideBusTile,
                        })}
                    >
                        {hideBikeTile ? null : <BikeTile />}
                        {hideScooterTile ? null : <ScooterTile />}
                        {hideCarTile ? null : <CarTile />}
                    </div>
                </div>
                <PosterFooter />
            </div>
        </div>
    )
}

export { Poster }
