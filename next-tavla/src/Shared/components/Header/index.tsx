import TavlaLogoWhite from 'assets/logos/Tavla-white.svg'
import TavlaLogoBlue from 'assets/logos/Tavla-blue.svg'
import Image from 'next/image'
import classes from './styles.module.css'
import { TLogo, TTheme } from 'types/settings'
import { Clock } from 'components/Clock'
import classNames from 'classnames'

function Header({
    theme,
    className,
    organizationLogo,
}: {
    theme?: TTheme
    className?: string
    organizationLogo?: TLogo | null
}) {
    const tavlaLogo = theme === 'light' ? TavlaLogoBlue : TavlaLogoWhite

    return (
        <div className={classNames(classes.headerWrapper, className)}>
            <Image
                style={{ position: 'relative' }}
                src={organizationLogo ?? tavlaLogo}
                alt="Entur Tavla logo"
                className={classes.logo}
                fill
            />
            <Clock />
        </div>
    )
}

export { Header }
