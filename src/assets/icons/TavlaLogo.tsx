import React from 'react'
import { Theme } from '../../types'
import { useSettings } from '../../settings/SettingsProvider'
import TavlaWhite from '../logos/Tavla-white.svg'
import TavlaBlue from '../logos/Tavla-blue.svg'

function TavlaLogo({ className, forceColor }: Props): JSX.Element {
    const [settings] = useSettings()

    if (forceColor) {
        const LogoSource = forceColor === 'blue' ? TavlaBlue : TavlaWhite
        return <img src={LogoSource} className={className} />
    }

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
            return <img src={TavlaWhite} className={className} />
    }
}

interface Props {
    className?: string
    forceColor?: 'blue' | 'white'
}

export { TavlaLogo }
