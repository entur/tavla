import React from 'react'

import { Operator } from '@entur/sdk/lib/mobility/types'

import Voi from '../logos/Voi.svg'
import Lime from '../logos/Lime.svg'
import Tier from '../logos/Tier.svg'
import { VehicleOperator } from '../../constants'

function ScooterOperatorLogo({
    operator,
    className,
    size,
}: Props): JSX.Element | null {
    if (operator?.id === VehicleOperator.VOI) {
        return (
            <img src={Voi} width={size} height={size} className={className} />
        )
    } else if (operator?.id === VehicleOperator.TIER) {
        return (
            <img src={Tier} width={size} height={size} className={className} />
        )
    } else if (operator?.id === VehicleOperator.LIME) {
        return (
            <img src={Lime} width={size} height={size} className={className} />
        )
    }
    return null
}

interface Props {
    operator: Operator | null
    className?: string
    size?: number
}

export default ScooterOperatorLogo
