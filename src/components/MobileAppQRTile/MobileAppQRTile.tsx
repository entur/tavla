import React from 'react'
import { Heading2 } from '@entur/typography'
import { Tile } from '../Tile/Tile'
import { QRCodeWrapper } from '../QRCodeWarapper/QRCodeWrapper'
import classes from './MobileAppQRTile.module.scss'

const MobileAppQRTile = (): JSX.Element => (
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
export { MobileAppQRTile }
