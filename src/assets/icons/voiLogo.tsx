import React from 'react'

import Voi from './../logos/voi-logo.svg'

function VoiLogo({ className, height }: Props): JSX.Element {
    return <img src={Voi} height={height} className={className} />
}

interface Props {
    className?: string
    height?: string
}

export default VoiLogo
