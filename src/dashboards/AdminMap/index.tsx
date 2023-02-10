import React from 'react'
import classes from 'containers/Admin/EditTab/EditTab.module.scss'
import { StopPlaceTile } from 'containers/Admin/EditTab/StopPlaceTile/StopPlaceTile'
import { HeadingAndDistance } from 'containers/Admin/EditTab/HeadingAndDistance/HeadingAndDistance'
import { BikeTile } from 'containers/Admin/EditTab/BikeTile/BikeTile'
import { WeatherTile } from 'containers/Admin/EditTab/WeatherTile/WeatherTile'
import { RealtimeTile } from 'containers/Admin/EditTab/RealtimeTile/RealtimeTile'
import { ScooterTile } from 'src/containers/Admin/EditTab/ScooterTile/ScooterTile'
import { Heading4 } from '@entur/typography'

export function AdminMap() {
    return (
        <div className={classes.EditTab}>
            <HeadingAndDistance />
            <Heading4 className={classes.TilesHeading}>
                Mobilitetstilbud
            </Heading4>
            <div className={classes.TilesContainer}>
                <StopPlaceTile />
                <ScooterTile />
                <BikeTile />
            </div>
            <Heading4 className={classes.TilesHeading}>Annet</Heading4>
            <div className={classes.TilesContainer}>
                <div>
                    <WeatherTile />
                </div>
                <RealtimeTile />
            </div>
        </div>
    )
}
