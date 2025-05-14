'use client'

import { Board } from 'Board/scenarios/Board'
import { Footer } from 'components/Footer'
import { Header } from 'components/Header'
import { TBoard, TFolder } from 'types/settings'

function Preview({ board, folder }: { board: TBoard; folder?: TFolder }) {
    return (
        <div
            className="previewContainer md:text-2xl"
            data-theme={board?.theme ?? 'dark'}
        >
            <Header theme={board.theme} folderLogo={folder?.logo} />
            <div className="md:h-[50rem] h-96">
                <Board board={board} />
            </div>
            <Footer
                board={board}
                logo={folder?.logo !== undefined}
                orgFooter={folder?.footer}
            />
        </div>
    )
}

export { Preview }
