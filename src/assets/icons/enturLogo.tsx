import React from 'react'

import EnturWhite from '../logos/Enturlogo_white.svg'
import EnturBlack from '../logos/Enturlogo_black.svg'
import EnturContrast from '../logos/Enturlogo_contrast.svg'

function EnturLogo({ className, style, height }: Props): JSX.Element {
    const enturLogo =
        style === 'black'
            ? EnturBlack
            : style === 'white'
            ? EnturWhite
            : EnturContrast

    return <img src={enturLogo} height={height} className={className} />
}

interface Props {
    className?: string
    style?: 'white' | 'black' | 'contrast'
    height?: string
}

export default EnturLogo
