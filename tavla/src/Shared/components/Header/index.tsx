import TavlaLogoBlue from 'assets/logos/Tavla-blue.svg'
import TavlaLogoWhite from 'assets/logos/Tavla-white.svg'
import { Clock } from 'components/Clock'
import Image from 'next/image'
import { BoardTheme } from 'types/db-types/boards'
import { FolderDB } from 'types/db-types/folders'

type Props = {
    theme?: BoardTheme
    folderLogo?: FolderDB['logo'] | null
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
        <div className="mb-em-0.25 flex flex-row items-center justify-between gap-em-3">
            <div className="relative h-[1.25em] w-full">
                {!hideLogo && (
                    <Image
                        src={folderLogo ?? tavlaLogo}
                        alt="Logo til tavlen"
                        className="h-full w-auto object-contain object-left"
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
