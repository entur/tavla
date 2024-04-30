import Image from 'next/image'
import EnturLogoWhite from 'assets/logos/Tavla-white.svg'
import EnturLogoBlue from 'assets/logos/Tavla-blue.svg'
import { TTheme } from 'types/settings'
import { CSSProperties } from 'react'

function Footer({
    theme,
    logo,
    footer,
    style,
}: {
    theme?: string
    logo?: boolean
    footer?: string
    style?: CSSProperties
}) {
    if (!logo && !footer) return null

    const EnturLogo = getLogo(theme)

    return (
        <footer className="flex flex-row text-white justify-between text-2xl">
            <div
                style={style}
                className="overflow-hidden whitespace-nowrap overflow-ellipsis text-tooltip"
            >
                {footer}
            </div>
            {logo && (
                <Image
                    src={theme === 'light' ? EnturLogoBlue : EnturLogoWhite}
                    alt="Entur logo"
                    height={40}
                />
            )}
        </footer>
    )
}

export function getLogo(theme: TTheme) {
    if (theme === 'light') return EnturLogoBlue
    return EnturLogoWhite
}

export { Footer }
