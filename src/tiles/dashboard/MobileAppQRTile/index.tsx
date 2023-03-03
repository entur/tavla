import React from 'react'
import { Tile } from 'components/Tile'
import classNames from 'classnames'
import { QrCodeEnturApp } from 'assets/icons/QrCodeEnturApp'
import { Heading2 } from '@entur/typography'
import classes from './MobileAppQRTile.module.scss'

function MobileAppQRTile({ size }: { size: string }) {
    return (
        <Tile className={classes.Tile}>
            <Heading2 className={classes.Title}>Last ned Entur-appen!</Heading2>
            <div className={classNames(classes.Wrapper)}>
                <QrCodeEnturApp size={size} />
            </div>
        </Tile>
    )
}
export { MobileAppQRTile }
