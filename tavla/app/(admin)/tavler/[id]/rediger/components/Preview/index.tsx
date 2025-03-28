'use client'

import { Board } from 'Board/scenarios/Board'
import { Footer } from 'components/Footer'
import { Header } from 'components/Header'
import { TBoard, TOrganization } from 'types/settings'

function Preview({
    board,
    organization,
}: {
    board: TBoard
    organization?: TOrganization
}) {
    return (
        <div
            className="previewContainer md:text-2xl"
            data-theme={board?.theme ?? 'dark'}
        >
            <Header theme={board.theme} organizationLogo={organization?.logo} />
            <div className="md:h-[50rem] h-96">
                <Board board={board} />
            </div>
            <Footer
                board={board}
                logo={organization?.logo !== undefined}
                orgFooter={organization?.footer}
            />
        </div>
    )
}

export { Preview }
