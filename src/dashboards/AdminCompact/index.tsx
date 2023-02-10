import React from 'react'
import classes from 'containers/Admin/EditTab/EditTab.module.scss'
import { StopPlaceTile } from 'containers/Admin/EditTab/StopPlaceTile/StopPlaceTile'
import { HeadingAndDistance } from 'containers/Admin/EditTab/HeadingAndDistance/HeadingAndDistance'
import { BikeTile } from 'src/containers/Admin/EditTab/BikeTile/BikeTile'
import { WeatherTile } from 'src/containers/Admin/EditTab/WeatherTile/WeatherTile'
import { CustomTile } from 'src/containers/Admin/EditTab/CustomTile/CustomTile'
import { MobileAppTile } from 'src/containers/Admin/EditTab/MobileAppTile/MobileAppTile'
import { Heading4 } from '@entur/typography'

export function AdminCompact() {
    return (
        <div className={classes.EditTab}>
            <HeadingAndDistance />
            <Heading4 className={classes.TilesHeading}>
                Mobilitetstilbud
            </Heading4>
            <div className={classes.TilesContainer}>
                <StopPlaceTile />
                <BikeTile />
            </div>
            <Heading4 className={classes.TilesHeading}>Annet</Heading4>
            <div className={classes.TilesContainer}>
                <div>
                    <WeatherTile />
                    <CustomTile />
                    <MobileAppTile />
                </div>
            </div>
        </div>
    )
}
