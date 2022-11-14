import React from 'react'
import { CustomTileType } from '../../types'
import { QRTile } from './QRTile'
import './QRTileWrapper.scss'

const QRTileWrapper = (): JSX.Element => (
    <div className="qr-tile-wrapper">
        <text className="qr-tile-wrapper-title">Last ned Entur-appen!</text>
        <div className="qr-tile-wrapper-flex">
            <QRTile
                id="entur-app"
                sourceUrl="https://apps.apple.com/no/app/entur-journey-planner/id1225135707"
                description="App Store"
                type={CustomTileType.QR}
                displayName="entur-app-appstore"
            />
            <QRTile
                id="entur-app"
                sourceUrl="https://play.google.com/store/apps/details?id=no.entur&hl=en&gl=NO"
                description="Google Play"
                type={CustomTileType.QR}
                displayName="entur-app-playstore"
            />
        </div>
    </div>
)
export { QRTileWrapper }
