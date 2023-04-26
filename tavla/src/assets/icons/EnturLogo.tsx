import React from 'react'
import { enturLogo } from 'utils/utils'
import { EnturLogoStyle } from 'src/types'

function EnturLogo({
    className,
    style,
    height,
}: {
    className?: string
    style?: EnturLogoStyle
    height?: string
}): JSX.Element {
    return <img src={enturLogo(style)} height={height} className={className} />
}

export { EnturLogo }
