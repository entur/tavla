'use client'

import { Board } from 'Board/scenarios/Board'
import { Header } from 'components/Header'
import { InfoMessage } from 'components/InfoMessage'
import { TBoard, TFolder } from 'types/settings'

function Preview({ board, folder }: { board: TBoard; folder?: TFolder }) {
    return (
        <div
            className="previewContainer md:text-2xl"
            data-theme={board?.theme ?? 'dark'}
        >
            <Header
                theme={board.theme}
                folderLogo={folder?.logo}
                hideClock={board.hideClock}
                hideLogo={board.hideLogo}
            />
            <div className="h-96 md:h-[50rem]">
                <Board board={board} />
            </div>
            <InfoMessage
                board={board}
                showEnturLogo={folder?.logo !== undefined || board?.hideLogo}
            />
        </div>
    )
}

export { Preview }
