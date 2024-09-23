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
    landingPage?: boolean
}) {
    return (
        <div
            className="previewContainer text-2xl"
            data-theme={board?.theme ?? 'dark'}
        >
            <Header theme={board.theme} organizationLogo={organization?.logo} />
            <div className="h-[50rem]">
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
