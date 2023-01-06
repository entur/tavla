import React from 'react'
import { Heading2 } from '@entur/typography'
import classes from './TileHeader.module.scss'

interface TileHeaderProps {
    title: string
    icons: JSX.Element | JSX.Element[]
}

const TileHeader: React.FC<TileHeaderProps> = ({ title, icons }) => (
    <header className={classes.TileHeader} tabIndex={0} aria-label={title}>
        <Heading2 className={classes.Heading}>{title}</Heading2>
        <div className={classes.Icons}>{icons}</div>
        <Heading2 className={classes.Heading}>{title}</Heading2>
    </header>
)

export { TileHeader }
