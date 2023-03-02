import React from 'react'
import { Tile } from 'components/Tile'
import { QRCodeWrapper } from 'components/QRCodeWarapper/QRCodeWrapper'
import { Heading2 } from '@entur/typography'
import classes from './MobileAppQRTile.module.scss'

function MobileAppQRTile() {
    return (
        <Tile className={classes.Tile}>
            <Heading2 className={classes.Title}>Last ned Entur-appen!</Heading2>
            <QRCodeWrapper className={classes.Code} />
        </Tile>
    )
}
export { MobileAppQRTile }
