import React from 'react'
import Pin from '../logos/pin.svg'

function PositionPin({
    className,
    size,
}: {
    className?: string
    size?: number | string
}): JSX.Element | null {
    return <img src={Pin} width={size} height={size} className={className} />
}

export { PositionPin }
