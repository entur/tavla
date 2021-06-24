import React from 'react'
import { Heading2 } from '@entur/typography'
import './styles.scss'

export function Tile({ title, icons, children }: Props): JSX.Element {
    return (
        <div className="tile">
            <header className="tile__header">
                <Heading2>{title}</Heading2>
                <div className="tile__header-icons">{icons}</div>
            </header>
            {children}
        </div>
    )
}

interface Props {
    title: string
    icons: JSX.Element | JSX.Element[]
    children: JSX.Element[]
}

export default Tile
