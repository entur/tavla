import React from 'react'
import { Theme } from 'src/types'
import TavlaWhite from '../logos/Tavla-white.svg'
import TavlaBlue from '../logos/Tavla-blue.svg'

function TavlaLogo({
    className,
    theme = Theme.DEFAULT,
}: {
    className?: string
    theme?: Theme
}) {
    switch (theme) {
        case Theme.LIGHT:
            return (
                <img
                    src={TavlaBlue}
                    className={className}
                    alt="Logo Entur Tavla og link til landingsside"
                />
            )
        case Theme.GREY:
            return (
                <img
                    src={TavlaBlue}
                    className={className}
                    alt="Logo Entur Tavla og link til landingsside"
                />
            )
        case Theme.DARK:
            return (
                <img
                    src={TavlaWhite}
                    className={className}
                    alt="Logo Entur Tavla og link til landingsside"
                />
            )
        case Theme.DEFAULT:
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
