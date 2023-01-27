import React from 'react'
import { Heading4 } from '@entur/typography'
import { OpeningHours } from '../OpeningHours/OpeningHours'
import { PosterMobilityAlert } from './PosterMobilityAlert'
import { StopPlaceTile } from './StopPlaceTile/StopPlaceTile'
import { WeatherTile } from './WeatherTile/WeatherTile'
import { ScooterTile } from './ScooterTile/ScooterTile'
import { CarSharingTile } from './CarSharingTile/CarSharingTile'
import { BikeTile } from './BikeTile/BikeTile'
import { CustomTile } from './CustomTile/CustomTile'
import { MobileAppTile } from './MobileAppTile/MobileAppTile'
import { RealtimeTile } from './RealtimeTile/RealtimeTile'
import { ReloadTile } from './ReloadTile/ReloadTile'
import { HeadingAndDistance } from './HeadingAndDistance/HeadingAndDistance'
import classes from './EditTab.module.scss'

const EditTab = (): JSX.Element => (
    <div className={classes.EditTab}>
        <HeadingAndDistance />
        <PosterMobilityAlert />
        <Heading4 className={classes.TilesHeading}>Mobilitetstilbud</Heading4>
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
                <OpeningHours />
            </div>
            <RealtimeTile />
            <ReloadTile />
        </div>
    </div>
)

export { EditTab }
