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
        <div className="flex flex-row justify-between items-center gap-em-3">
            <div className="relative w-full h-full">
                <Image
                    src={folderLogo ?? tavlaLogo}
                    alt="Logo til tavlen"
                    className="object-contain object-left w-[104px] h-[27px] md:w-[208px] md:h-[55px]"
                    width="100"
                    height="100"
                />
            </div>
            <Clock />
        </div>
    )
}

export { Header }
