import TavlaLogoWhite from 'assets/logos/Tavla-white.svg'
import TavlaLogoBlue from 'assets/logos/Tavla-blue.svg'
import Image from 'next/image'
import { TLogo, TTheme } from 'types/settings'
import { Clock } from 'components/Clock'

function Header({
    theme,
    folderLogo,
}: {
    theme?: TTheme
    folderLogo?: TLogo | null
}) {
    const tavlaLogo = theme === 'light' ? TavlaLogoBlue : TavlaLogoWhite

    return (
        <div className="flex flex-row items-center justify-between gap-em-3">
            <div className="relative h-full w-full">
                <Image
                    src={folderLogo ?? tavlaLogo}
                    alt="Logo til tavlen"
                    className="h-[27px] w-[104px] object-contain object-left md:h-[55px] md:w-[208px]"
                    width="100"
                    height="100"
                />
            </div>
            <Clock />
        </div>
    )
}

export { Header }
