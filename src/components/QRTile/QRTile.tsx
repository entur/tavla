import React from 'react'
import classNames from 'classnames'
import { Heading2 } from '@entur/typography'
import { Tile } from '../Tile/Tile'
import { QRCodeWrapper } from '../QRCodeWarapper/QRCodeWrapper'
import classes from './QRTile.module.scss'

interface Props {
    className?: string
    title: string
    sourceUrl: string
    description?: string
}

const QRTile: React.FC<Props> = ({
    className,
    title,
    sourceUrl,
    description,
}) => (
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

export { QRTile }
