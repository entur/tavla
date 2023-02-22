import React from 'react'
import { Heading2 } from '@entur/typography'
import classes from './TileHeader.module.scss'

function TileHeader({
    title,
    icons,
}: {
    title: string
    icons: JSX.Element | JSX.Element[]
}) {
    return (
        <header className={classes.TileHeader}>
            <div className={classes.Icons}>{icons}</div>
            <Heading2 className={classes.Heading}>{title}</Heading2>
        </header>
    )
}

export { TileHeader }
