'use client'

import { Board } from 'Board/scenarios/Board'
import { Footer } from 'components/Footer'
import { Header } from 'components/Header'
import { TBoard, TOrganization } from 'types/settings'

function Preview({
    board,
    organization,
    landingPage,
}: {
    board: TBoard
    organization?: TOrganization
    landingPage?: boolean
}) {
    return (
        <div
            className={`rounded p-4 bg-primary border border-secondary ${
                landingPage ? 'text-xs' : 'text-2xl'
            }`}
            data-theme={board?.theme ?? 'dark'}
        >
            <Header theme={board.theme} organizationLogo={organization?.logo} />
            <div
                className={`${
                    landingPage ? 'md:h-[32em] h-[34em]' : 'h-[50rem]'
                }`}
            >
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
