import React from 'react'

import TavlaWhite from './../logos/Tavla-white.svg'
import TavlaBlue from './../logos/Tavla-blue.svg'
import TavlaPositive from './../logos/Tavla-positive.svg'
import TavlaNegative from './../logos/Tavla-negative.svg'

function TavlaLogo({ className, theme }: Props): JSX.Element {
    let logo = ''
    switch (theme) {
        case 'light':
            logo = TavlaBlue
            break
        case 'dark':
            logo = TavlaWhite
            break
        case 'positive':
            logo = TavlaPositive
            break
        case 'negative':
            logo = TavlaNegative
            break
    }

    return <img src={logo} className={className} />
}

interface Props {
    className?: string
    theme?: 'dark' | 'light' | 'positive' | 'negative'
}

export default TavlaLogo
