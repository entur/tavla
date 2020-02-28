import React from 'react'
import { Heading3 } from '@entur/typography'

import './styles.scss'

export function TileRow({ label, icon, subLabel }: Props): JSX.Element {
    return (
        <div className="tilerow">
            <div className="tilerow__icon">{icon}</div>
            <Heading3 className="tilerow__label">{label}</Heading3>
            <div className="tilerow__sublabel">{subLabel}</div>
        </div>
    )
}

interface Props {
    label: string
    subLabel?: string
    icon: JSX.Element
}

export default TileRow
