import Image from 'next/image'
import EnturLogoWhite from 'assets/logos/Tavla-white.svg'
import EnturLogoBlue from 'assets/logos/Tavla-blue.svg'
import { TTheme } from 'types/settings'

function Footer({
    logo,
    footer,
    theme,
}: {
    logo?: boolean
    footer?: string
    theme: TTheme
}) {
    if (!logo && !footer) return null

    const EnturLogo = getLogo(theme)

    return (
        <footer className="flex flex-row justify-start items-center text-2xl">
            <div className="ellipsis">{footer ? footer : ''}</div>
            {logo && <Image src={EnturLogo} alt="Entur logo" height={40} />}
        </footer>
    )
}

export function getLogo(theme: TTheme) {
    if (theme === 'light') return EnturLogoBlue
    return EnturLogoWhite
}

export { Footer }
