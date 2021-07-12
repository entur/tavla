import React from 'react'
import { Heading2 } from '@entur/typography'
import './styles.scss'

export function Tile({ title, icons, walkTime, children }: Props): JSX.Element {
    return (
        <div className="tile">
            <header className="tile__header">
                <Heading2>{title}</Heading2>
                <div className="tile__header-icons">{icons}</div>
            </header>
            {walkTime ? (
                <div className="tile__walking-time">
                    {`${Math.ceil(walkTime / 60)} minutt å gå.`}
                </div>
            ) : null}
            {children}
        </div>
    )
}

interface Props {
    title: string
    icons: JSX.Element | JSX.Element[]
    walkTime?: number
    children: JSX.Element[]
}

export default Tile
