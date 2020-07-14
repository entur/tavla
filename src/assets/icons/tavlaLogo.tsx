import React from 'react'

import TavlaWhite from './../logos/Tavla-white.svg'
import TavlaBlue from './../logos/Tavla-blue.svg'
import TavlaPositive from './../logos/Tavla-positive.svg'
import TavlaNegative from './../logos/Tavla-negative.svg'

function TavlaLogo({ className, theme }: Props): JSX.Element {
    let tavlaLogo = ''

    switch (theme) {
        case 'light':
            tavlaLogo = TavlaBlue
            break
        case 'dark':
            tavlaLogo = TavlaWhite
            break
        case 'positive':
            tavlaLogo = TavlaPositive
            break
        case 'negative':
            tavlaLogo = TavlaNegative
            break
        default:
            tavlaLogo = TavlaWhite
    }
    return <img src={tavlaLogo} className={className} />
}

interface Props {
    className?: string
    theme?: 'dark' | 'light' | 'positive' | 'negative'
}

export default TavlaLogo
