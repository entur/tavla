import React from 'react'

import Voi from './../logos/voi-logo.svg'
import Lime from './../logos/lime-24.svg'
import Tier from './../logos/tier-logo.svg'

function ScooterOperatorLogo({ logo, className, height }: Props): JSX.Element {
    if (logo === 'Voi') {
        return <img src={Voi} height={height} className={className} />
    } else if (logo === 'Tier') {
        return <img src={Tier} height={height} className={className} />
    } else if (logo === 'Lime') {
        return <img src={Lime} height={height} className={className} />
    }
    return <img src={Tier} height={height} className={className} />
}

interface Props {
    logo: any
    className?: string
    height?: string
}

export default ScooterOperatorLogo
