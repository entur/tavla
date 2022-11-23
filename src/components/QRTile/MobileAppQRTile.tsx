import React from 'react'
import { CustomTileType } from '../../types'
import { Tile } from '../Tile/Tile'
import { QRBox } from './QRBox'
import classes from './MobileAppQRTile.module.scss'

const MobileAppQRTile = (): JSX.Element => (
    <Tile>
        <div className={classes.TitleWrapper}>Last ned Entur-appen!</div>
        <div className={classes.Flex}>
            <QRBox
                id="entur-app"
                sourceUrl="https://apps.apple.com/no/app/entur-journey-planner/id1225135707"
                description="App Store"
                type={CustomTileType.QR}
                displayName="entur-app-appstore"
            />
            <QRBox
                id="entur-app"
                sourceUrl="https://play.google.com/store/apps/details?id=no.entur&hl=en&gl=NO"
                description="Google Play"
                type={CustomTileType.QR}
                displayName="entur-app-playstore"
            />
        </div>
    </Tile>
)
export { MobileAppQRTile }
