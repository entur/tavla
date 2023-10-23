import TavlaLogo from 'assets/logos/Tavla-white.svg'
import TavlaLogoLight from 'assets/logos/Tavla-blue.svg'
import Image from 'next/image'
import classes from './styles.module.css'
import { TLogoUrl, TTheme } from 'types/settings'
import { Clock } from 'components/Clock'
import classNames from 'classnames'

function Header({
    theme,
    className,
    logo,
}: {
    theme?: TTheme
    className?: string
    logo?: TLogoUrl
}) {
    return (
        <div className={classNames(classes.headerWrapper, className)}>
            <div>
                {theme === 'light' ? (
                    <Image
                        src={logo ?? TavlaLogoLight}
                        alt="Entur Tavla logo"
                        width={117}
                        height={20}
                        className={classes.logo}
                    />
                ) : (
                    <Image
                        src={logo ?? TavlaLogo}
                        alt="Entur Tavla logo"
                        width={117}
                        height={20}
                        className={classes.logo}
                    />
                )}
            </div>
            <Clock />
        </div>
    )
}

export { Header }
