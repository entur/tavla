import React from 'react'

import Voi from './../logos/voi-logo.svg'
import Lime from './../logos/lime-24.svg'
import Tier from './../logos/tier-logo.svg'

function ScooterLogo({ logo, className, height }: Props): JSX.Element {
    return <img src={V} height={height} className={className} />
}

interface Props {
    className?: string
    height?: string
}

export default ScooterLogo
