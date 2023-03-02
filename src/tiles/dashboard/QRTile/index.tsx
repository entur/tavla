import React from 'react'
import classNames from 'classnames'
import { QRCodeWrapper } from 'components/QRCodeWarapper/QRCodeWrapper'
import { Tile } from 'components/Tile'
import { Heading2 } from '@entur/typography'
import classes from './QRTile.module.scss'

function QRTile({ className, title }: { className?: string; title: string }) {
    return (
        <Tile className={classNames(classes.Tile, className)}>
            <Heading2 className={classes.Title}>{title}</Heading2>
            <QRCodeWrapper className={classes.Code} />
        </Tile>
    )
}

export { QRTile }
