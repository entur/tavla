import TavlaLogoBlue from 'assets/logos/Tavla-blue.svg'
import TavlaLogoWhite from 'assets/logos/Tavla-white.svg'
import { Clock } from 'components/Clock'
import Image from 'next/image'
import { TLogo, TTheme } from 'types/settings'

type Props = {
    theme?: TTheme
    folderLogo?: TLogo | null
    hideClock?: boolean
    hideLogo?: boolean
}

function Header({
    theme,
    folderLogo,
    hideClock = false,
    hideLogo = false,
}: Props) {
    const tavlaLogo = theme === 'light' ? TavlaLogoBlue : TavlaLogoWhite

    if (hideClock && hideLogo) return null

    return (
        <div className="flex flex-row items-center justify-between gap-em-3">
            <div className="relative h-full w-full">
                {!hideLogo && (
                    <Image
                        src={folderLogo ?? tavlaLogo}
                        alt="Logo til tavlen"
                        className="h-[27px] w-[104px] object-contain object-left md:h-[55px] md:w-[208px]"
                        width="100"
                        height="100"
                    />
                )}
            </div>
            {!hideClock && <Clock />}
        </div>
    )
}

export { Header }
