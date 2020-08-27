import React from 'react'

import Voi from './../logos/voi-logo.svg'
import Lime from './../logos/lime-24.svg'
import Tier from './../logos/tier-logo.svg'
import { ScooterOperator } from '@entur/sdk'

function ScooterOperatorLogo({ logo, className, height }: Props): JSX.Element {
    if (logo === ScooterOperator.VOI) {
        return <img src={Voi} height={height} className={className} />
    } else if (logo === ScooterOperator.TIER) {
        return <img src={Tier} height={height} className={className} />
    } else if (logo === ScooterOperator.LIME) {
        return <img src={Lime} height={height} className={className} />
    }
    return <img src={Tier} height={height} className={className} />
}

interface Props {
    logo: string
    className?: string
    height?: string
}

export default ScooterOperatorLogo
