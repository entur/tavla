import Image from 'next/image'
import EnturLogoWhite from 'assets/logos/Tavla-white.svg'
import EnturLogoBlue from 'assets/logos/Tavla-blue.svg'
import { TTheme } from 'types/settings'

function Footer({
    theme,
    logo,
    footer,
    fontSize,
}: {
    theme: TTheme
    logo?: boolean
    footer?: string
    fontSize?: string
}) {
    if (!logo && !footer) return null

    const EnturLogo = getLogo(theme)

    return (
        <footer className="flex flex-row text-white justify-between">
            <div
                className={`overflow-hidden whitespace-nowrap overflow-ellipsis text-primary ${fontSize}`}
            >
                {footer}
            </div>
            {logo && <Image src={EnturLogo} alt="Entur logo" height={40} />}
        </footer>
    )
}

export function getLogo(theme: TTheme) {
    if (theme === 'light') return EnturLogoBlue
    return EnturLogoWhite
}

export { Footer }
