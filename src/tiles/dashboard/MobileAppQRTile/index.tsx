import React from 'react'
import { Tile } from 'components/Tile'
import { QRCodeWrapper } from 'components/QRCodeWarapper/QRCodeWrapper'
import { Heading2 } from '@entur/typography'
import classes from './MobileAppQRTile.module.scss'

function MobileAppQRTile() {
    return (
        <Tile className={classes.Tile}>
            <Heading2 className={classes.Title}>Last ned Entur-appen!</Heading2>
            <div className={classes.Flex}>
                <QRCodeWrapper
                    className={classes.Code}
                    sourceUrl="https://apps.apple.com/no/app/entur-journey-planner/id1225135707"
                    description="App Store"
                />
                <QRCodeWrapper
                    className={classes.Code}
                    sourceUrl="https://play.google.com/store/apps/details?id=no.entur&hl=en&gl=NO"
                    description="Google Play"
                />
            </div>
        </Tile>
    )
}
export { MobileAppQRTile }
