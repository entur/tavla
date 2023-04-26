import React from 'react'
import { HeadingAndDistance } from 'tiles/admin/HeadingAndDistance/HeadingAndDistance'
import { StopPlaceTile } from 'tiles/admin/StopPlaceTile'
import { ScooterTile } from 'tiles/admin/ScooterTile'
import { CarSharingTile } from 'tiles/admin/CarSharingTile/CarSharingTile'
import { WeatherTile } from 'tiles/admin/WeatherTile'
import { CustomTile } from 'tiles/admin/CustomTile'
import { MobileAppTile } from 'tiles/admin/MobileAppTile'
import { RealtimeTile } from 'tiles/admin/RealtimeTile'
import { ReloadTile } from 'tiles/admin/ReloadTile'
import { BikeTile } from 'tiles/admin/BikeTile'
import { Heading4 } from '@entur/typography'
import classes from './EditTab.module.scss'
import { PosterMobilityAlert } from './components/PosterMobilityAlert'

function EditTab() {
    return (
        <div className={classes.EditTab}>
            <HeadingAndDistance />
            <PosterMobilityAlert />
            <Heading4 className={classes.TilesHeading}>
                Mobilitetstilbud
            </Heading4>
            <div className={classes.TilesContainer}>
                <StopPlaceTile />
                <div>
                    <ScooterTile />
                    <CarSharingTile />
                </div>
                <BikeTile />
            </div>
            <Heading4 className={classes.TilesHeading}>Annet</Heading4>
            <div className={classes.TilesContainer}>
                <div>
                    <WeatherTile />
                    <CustomTile />
                    <MobileAppTile />
                </div>
                <RealtimeTile />
                <ReloadTile />
            </div>
        </div>
    )
}

export { EditTab }
