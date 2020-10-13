import React from 'react'

import { ScooterOperator } from '@entur/sdk'

import Voi from '../logos/Voi.svg'
import Lime from '../logos/Lime.svg'
import Tier from '../logos/Tier.svg'
import Zvipp from '../logos/Zvipp.svg'

function ScooterOperatorLogo({
    logo,
    className,
    size,
}: Props): JSX.Element | null {
    if (logo === ScooterOperator.VOI) {
        return (
            <img src={Voi} width={size} height={size} className={className} />
        )
    } else if (logo === ScooterOperator.TIER) {
        return (
            <img src={Tier} width={size} height={size} className={className} />
        )
    } else if (logo === ScooterOperator.LIME) {
        return (
            <img src={Lime} width={size} height={size} className={className} />
        )
    } else if (logo === ScooterOperator.ZVIPP) {
        return (
            <img src={Zvipp} width={size} height={size} className={className} />
        )
    }
    return null
}

interface Props {
    logo: ScooterOperator
    className?: string
    size?: string
}

export default ScooterOperatorLogo
