import React from 'react'
import { Theme } from 'src/types'
import TavlaWhite from '../logos/Tavla-white.svg'
import TavlaBlue from '../logos/Tavla-blue.svg'

function TavlaLogo({
    className,
    theme = 'default',
}: {
    className?: string
    theme?: Theme
}) {
    switch (theme) {
        case 'light':
            return (
                <img
                    src={TavlaBlue}
                    className={className}
                    alt="Logo Entur Tavla og link til landingsside"
                />
            )
        case 'grey':
            return (
                <img
                    src={TavlaBlue}
                    className={className}
                    alt="Logo Entur Tavla og link til landingsside"
                />
            )
        case 'dark':
            return (
                <img
                    src={TavlaWhite}
                    className={className}
                    alt="Logo Entur Tavla og link til landingsside"
                />
            )
        case 'default':
            return (
                <img
                    src={TavlaWhite}
                    className={className}
                    alt="Logo Entur Tavla og link til landingsside"
                />
            )
    }
}

export { TavlaLogo }
