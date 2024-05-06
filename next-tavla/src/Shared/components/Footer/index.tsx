import Image from 'next/image'
import EnturLogoWhite from 'assets/logos/entur/Enturlogo_White.svg'
import EnturLogoBlue from 'assets/logos/entur/Enturlogo_Blue.svg'
import { TTheme } from 'types/settings'

function Footer({ theme }: { theme: TTheme }) {
    return (
        <footer className="flex flex-row justify-start items-center text-2xl text-primary">
            <span>Tjenesten leveres av</span>
            <Image src={getLogo(theme)} alt="Entur logo" height={70} />
        </footer>
    )
}

export { Footer }

export function getLogo(theme: TTheme) {
    if (theme === 'light') return EnturLogoBlue
    return EnturLogoWhite
}
