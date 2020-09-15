import React from 'react'
import { Heading2 } from '@entur/typography'

import './styles.scss'

function Tile({ title, icons, children }: Props): JSX.Element {
    return (
        <div className="tile">
            <header className="tile__header">
                <Heading2>{title}</Heading2>
                <div className="tile__header-icons">{icons}</div>
            </header>
            <div className="column-titles">
                <div>Linje </div>
                <div>Avgang</div>
                <div>Avvik</div>
            </div>


           
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
