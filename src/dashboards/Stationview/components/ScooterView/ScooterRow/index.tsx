import React from 'react'
import { Heading3, Heading5 } from '@entur/typography'

import './styles.scss'

function ScooterRow({ icon, operator, counter }: Props): JSX.Element {
    return (
        <div className="testing">
            <Heading3>
                {icon}
                {operator}
            </Heading3>
            <Heading5>I nærheten: 200m</Heading5>
            <Heading3>{counter} sparkesykler</Heading3>
        </div>
    )
}

interface Props {
    icon: JSX.Element
    operator: String
    counter: number
}

export default ScooterRow
