import TavlaLogoWhite from 'assets/logos/Tavla-white.svg'
import TavlaLogoBlue from 'assets/logos/Tavla-blue.svg'
import Image from 'next/image'
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
        <div
            className={classNames(
                'flex flex-row justify-between items-center gap-em-3',
                className,
            )}
        >
            <div className="relative w-full h-full">
                <Image
                    src={organizationLogo ?? tavlaLogo}
                    alt="Logo til tavlen"
                    className="object-contain object-left w-[104px] h-[27px] md:w-[208px] md:h-[55px]"
                />
            </div>
            <Clock />
        </div>
    )
}

export { Header }
