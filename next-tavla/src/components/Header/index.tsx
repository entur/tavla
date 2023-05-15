import TavlaLogo from 'assets/logos/Tavla-white.svg'
import TavlaLogoLight from 'assets/logos/Tavla-blue.svg'
import Image from 'next/image'
import classes from './styles.module.css'
import { TTheme } from 'types/settings'

function Header({ theme }: { theme?: TTheme }) {
    return (
        <div>
            {theme === 'light' ? (
                <Image
                    src={TavlaLogoLight}
                    alt="Entur Tavla logo"
                    width={117}
                    height={20}
                    className={classes.logo}
                />
            ) : (
                <Image
                    src={TavlaLogo}
                    alt="Entur Tavla logo"
                    width={117}
                    height={20}
                    className={classes.logo}
                />
            )}
            <p className="tag-text">
                Finn din rute på entur.no eller i Entur-appen
            </p>
        </div>
    )
}

export { Header }
