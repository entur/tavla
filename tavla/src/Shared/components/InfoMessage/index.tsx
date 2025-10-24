import EnturLogoBlue from 'assets/logos/Tavla-blue.svg'
import EnturLogoWhite from 'assets/logos/Tavla-white.svg'
import { defaultFontSize, getFontScale } from 'Board/scenarios/Board/utils'
import Image from 'next/image'
import { BoardDB, BoardTheme } from 'types/db-types/boards'

function InfoMessage({
    board,
    showEnturLogo: showEnturLogo,
}: {
    board: BoardDB
    showEnturLogo?: boolean
}) {
    if (!showEnturLogo && !board.footer?.footer) return null

    const EnturLogo = getLogo(board?.theme ?? 'dark')
    return (
        <footer className="flex flex-row items-center justify-between gap-em-2">
            <div
                className={`truncate leading-em-base text-primary ${
                    getFontScale(board.meta?.fontSize) || defaultFontSize(board)
                }`}
            >
                {board.footer?.footer}
            </div>
            {showEnturLogo && (
                <Image
                    src={EnturLogo}
                    alt="Entur logo"
                    className="ml-4 mt-4 h-[20px] w-[70px] object-contain md:h-[25px] md:w-[200px]"
                />
            )}
        </footer>
    )
}

export function getLogo(theme: BoardTheme) {
    if (theme === 'light') return EnturLogoBlue
    return EnturLogoWhite
}

export { InfoMessage }
