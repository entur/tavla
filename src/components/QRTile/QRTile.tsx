import React from 'react'
import classNames from 'classnames'
import { Tile } from 'components/Tile/Tile'
import { Heading2 } from '@entur/typography'
import { QRCodeWrapper } from '../QRCodeWarapper/QRCodeWrapper'
import classes from './QRTile.module.scss'

function QRTile({
    className,
    title,
    sourceUrl,
    description,
}: {
    className?: string
    title: string
    sourceUrl: string
    description?: string
}) {
    return (
        <Tile className={classNames(classes.Tile, className)}>
            <Heading2 className={classes.Title}>{title}</Heading2>
            <QRCodeWrapper
                className={classes.Code}
                sourceUrl={sourceUrl}
                description={description}
                size={110}
            />
        </Tile>
    )
}

export { QRTile }
