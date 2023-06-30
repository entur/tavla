import TavlaLogo from 'assets/logos/Tavla-white.svg'
import TavlaLogoLight from 'assets/logos/Tavla-blue.svg'
import Image from 'next/image'
import classes from './styles.module.css'
import { TTheme } from 'types/settings'
import { Clock } from 'Board/scenarios/Table/components/Clock'

function Header({ theme, clock }: { theme?: TTheme; clock?: boolean }) {
    return (
        <div className={classes.headerWrapper}>
            <div className={classes.logoWrapper}>
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
                <p className={classes.tagText}>
                    Finn din rute på entur.no eller i Entur-appen
                </p>
            </div>
            <div className={classes.clockWrapper}>{clock && <Clock />}</div>
        </div>
    )
}

export { Header }
