import React from 'react'
import classNames from 'classnames'
import { QrCodeEnturApp } from 'assets/icons/QrCodeEnturApp'
import classes from './MobileAppQRTile.module.scss'

function MobileAppQRTile({ size }: { size: string }) {
    return (
        <div className={classNames(classes.Wrapper)}>
            <QrCodeEnturApp size={size} />
        </div>
    )
}
export { MobileAppQRTile }
