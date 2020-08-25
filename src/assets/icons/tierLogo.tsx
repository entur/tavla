import React from 'react'

import Tier from './../logos/tier-logo.svg'

function TierLogo({ className, height }: Props): JSX.Element {
    return <img src={Tier} height={height} className={className} />
}

interface Props {
    className?: string
    height?: string
}

export default TierLogo
