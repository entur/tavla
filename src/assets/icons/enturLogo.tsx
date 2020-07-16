import React from 'react'

import EnturWhite from './../logos/Enturlogo_white.svg'
import EnturBlack from './../logos/Enturlogo_black.svg'

function EnturLogo({ className, style, height }: Props): JSX.Element {
    const enturLogo = style === 'black' ? EnturBlack : EnturWhite

    return <img src={enturLogo} height={height} className={className} />
}

interface Props {
    className?: string
    style?: 'white' | 'black'
    height?: string
}

export default EnturLogo
