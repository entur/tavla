import React from 'react'
import { Heading2 } from '@entur/typography'
import classes from './TileHeader.module.scss'

interface TileHeaderProps {
    title: string
    icons: JSX.Element | JSX.Element[]
}

const TileHeader: React.FC<TileHeaderProps> = ({ title, icons }) => (
    <header className={classes.TileHeader} tabIndex={0}>
        <Heading2 className={classes.Heading}>{title}</Heading2>
        <div className={classes.Icons}>{icons}</div>
    </header>
)

export { TileHeader }
