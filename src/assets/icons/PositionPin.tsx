import React from 'react'

import Pin from '../logos/pin.svg'

function PositionPin({ className, size }: Props): JSX.Element | null {
    return <img src={Pin} width={size} height={size} className={className} />
}

interface Props {
    className?: string
    size?: number | string
}

export { PositionPin }
