import React from 'react'

import Pin from './../logos/pin.svg'

function PositionPin({ className, width }: Props): JSX.Element | null {
    return <img src={Pin} width={width} height={width} className={className} />
}

interface Props {
    className?: string
    width?: string
}

export default PositionPin
