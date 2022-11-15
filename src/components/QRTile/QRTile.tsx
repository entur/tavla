import React from 'react'
import { CustomTileType } from '../../types'
import { QRBox } from './QRBox'
import './QRTile.scss'

const QRTile = (): JSX.Element => (
    <div className="tile tile__qr qr-tile-wrapper">
        <text className="qr-tile-wrapper-title">Last ned Entur-appen!</text>
        <div className="qr-tile-wrapper-flex">
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
    </div>
)
export { QRTile }
