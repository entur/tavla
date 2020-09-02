import React from 'react'

import Voi from './../logos/Voi.svg'
import Lime from './../logos/Lime.svg'
import Tier from './../logos/Tier.svg'
import Zvipp from './../logos/Zvipp.svg'
import { ScooterOperator } from '@entur/sdk'

function ScooterOperatorLogo({
    logo,
    className,
    width,
}: Props): JSX.Element | null {
    if (logo === ScooterOperator.VOI) {
        return (
            <img src={Voi} width={width} height={width} className={className} />
        )
    } else if (logo === ScooterOperator.TIER) {
        return (
            <img
                src={Tier}
                width={width}
                height={width}
                className={className}
            />
        )
    } else if (logo === ScooterOperator.LIME) {
        return (
            <img
                src={Lime}
                width={width}
                height={width}
                className={className}
            />
        )
    } else if (logo === ScooterOperator.ZVIPP) {
        return (
            <img
                src={Zvipp}
                width={width}
                height={width}
                className={className}
            />
        )
    }
    return null
}

interface Props {
    logo: ScooterOperator
    className?: string
    width?: string
}

export default ScooterOperatorLogo
