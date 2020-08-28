import React from 'react'

import Voi from './../logos/voi-logo.svg'
import Lime from './../logos/lime-24.svg'
import Tier from './../logos/tier-logo.svg'
import { ScooterOperator } from '@entur/sdk'

function ScooterOperatorLogo({
    logo,
    className,
    width,
}: Props): JSX.Element | null {
    if (logo === ScooterOperator.VOI) {
        return <img src={Voi} width={width} className={className} />
    } else if (logo === ScooterOperator.TIER) {
        return <img src={Tier} width={width} className={className} />
    } else if (logo === ScooterOperator.LIME) {
        return <img src={Lime} width={width} className={className} />
    }
    return null
}

interface Props {
    logo: ScooterOperator
    className?: string
    width?: string
}

export default ScooterOperatorLogo
