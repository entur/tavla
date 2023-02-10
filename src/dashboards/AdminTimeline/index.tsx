import React from 'react'
import classes from 'containers/Admin/EditTab/EditTab.module.scss'
import { StopPlaceTile } from 'containers/Admin/EditTab/StopPlaceTile/StopPlaceTile'
import { HeadingAndDistance } from 'containers/Admin/EditTab/HeadingAndDistance/HeadingAndDistance'
import { Heading4 } from '@entur/typography'

export function AdminTimeline() {
    return (
        <div className={classes.EditTab}>
            <HeadingAndDistance />
            <Heading4 className={classes.TilesHeading}>
                Mobilitetstilbud
            </Heading4>
            <div className={classes.TilesContainer}>
                <StopPlaceTile />
            </div>
        </div>
    )
}
