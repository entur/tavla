import React from 'react'
import { Tile } from 'components/Tile'
import { Heading2 } from '@entur/typography'
import classes from './QRWrapper.module.scss'

function QRWrapper({
    children,
    title,
}: {
    children: React.ReactNode
    title: string
}) {
    return (
        <Tile className={classes.Tile}>
            <Heading2 className={classes.Title}>{title}</Heading2>
            <div>{children}</div>
        </Tile>
    )
}
export { QRWrapper }
