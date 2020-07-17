import React from 'react'

import { Theme } from '../../types'

import TavlaWhite from './../logos/Tavla-white.svg'
import TavlaBlue from './../logos/Tavla-blue.svg'
import { useSettingsContext } from '../../settings'

function TavlaLogo({ className }: Props): JSX.Element {
    const [settings] = useSettingsContext()

    switch (settings?.theme) {
        case Theme.LIGHT:
            return <img src={TavlaBlue} className={className} />
        case Theme.GREY:
            return <img src={TavlaBlue} className={className} />
        case Theme.DARK:
            return <img src={TavlaWhite} className={className} />
        case Theme.DEFAULT:
            return <img src={TavlaWhite} className={className} />
        default:
            return <img src={TavlaBlue} className={className} />
    }
}

interface Props {
    className?: string
}

export default TavlaLogo
