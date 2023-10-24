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
    organizationLogo?: TLogo
}) {
    const tavlaLogo = theme === 'light' ? TavlaLogoBlue : TavlaLogoWhite

    const altImageProps = organizationLogo
        ? { fill: true }
        : { height: 55, width: 208 }

    return (
        <div className={classNames(classes.headerWrapper, className)}>
            <div className="positionRelative h-100 w-50">
                <Image
                    src={organizationLogo ?? tavlaLogo}
                    alt="Entur Tavla logo"
                    {...altImageProps}
                    className={classes.logo}
                />
            </div>
            <Clock />
        </div>
    )
}

export { Header }
