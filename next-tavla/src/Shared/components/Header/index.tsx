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
    title,
    style,
}: {
    theme?: TTheme
    className?: string
    organizationLogo?: TLogo | null
    title?: string
    style?: React.CSSProperties
}) {
    const tavlaLogo = theme === 'light' ? TavlaLogoBlue : TavlaLogoWhite

    return (
        <div
            className={classNames(classes.headerWrapper, className)}
            style={style}
        >
            <div className="flexRow alignCenter positionRelative w-100 h-100">
                <Image
                    src={organizationLogo ?? tavlaLogo}
                    alt="Entur Tavla logo"
                    className={
                        organizationLogo
                            ? classes.organizationLogo
                            : classes.logo
                    }
                    height={!organizationLogo ? 55 : undefined}
                    width={!organizationLogo ? 208 : undefined}
                />
                {title && <div className="ml-1">{title}</div>}
            </div>
            <Clock />
        </div>
    )
}

export { Header }
