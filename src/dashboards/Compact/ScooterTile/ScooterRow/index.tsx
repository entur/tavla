import React from 'react'
import { Heading3 } from '@entur/typography'

import './styles.scss'

function ScooterRow({ icon, operator, counter, distance }: Props): JSX.Element {
    return (
        <div className="scooterrow">
            <div className="scooterrow__icon">{icon}</div>
            <div className="scooterrow__texts">
                <Heading3 className="scooterrow__label">{operator}</Heading3>
                <div className="scooterrow__sublabels">
                    I nærheten ({distance} m)
                    <div className="scooterrow__sublabel">
                        {counter > 1
                            ? `${counter} sparkesykler`
                            : `${counter} sparkesykkel`}
                    </div>
                </div>
            </div>
        </div>
    )
}

interface Props {
    icon: JSX.Element
    operator: string
    counter: number
    distance: number
}

export default ScooterRow
