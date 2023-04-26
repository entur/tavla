import React from 'react'
import { Operator } from 'graphql-generated/mobility-v2'
import { ALL_ACTIVE_OPERATOR_IDS } from 'utils/constants'
import Voi from '../logos/Voi.svg'
import Tier from '../logos/Tier.svg'
import Bolt from '../logos/Bolt.svg'

function ScooterOperatorLogo({
    operator,
    className,
    size,
}: Props): JSX.Element | null {
    if (operator?.id === ALL_ACTIVE_OPERATOR_IDS.VOI) {
        return (
            <img src={Voi} width={size} height={size} className={className} />
        )
    } else if (operator?.id === ALL_ACTIVE_OPERATOR_IDS.TIER) {
        return (
            <img src={Tier} width={size} height={size} className={className} />
        )
    } else if (operator?.id === ALL_ACTIVE_OPERATOR_IDS.BOLT) {
        return (
            <img src={Bolt} width={size} height={size} className={className} />
        )
    }
    return null
}

interface Props {
    operator: Operator | null
    className?: string
    size?: number
}

export { ScooterOperatorLogo }
