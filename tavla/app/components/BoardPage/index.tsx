'use client'

import { Board } from 'Board/scenarios/Board'
import { Footer } from 'components/Footer'
import { Header } from 'components/Header'
import { useRefresh } from 'hooks/useRefresh'
import Head from 'next/head'
import { useEffect } from 'react'
import { TBoard, TOrganization } from 'types/settings'

function BoardPage({
    board,
    organization,
    backend_url,
}: {
    board: TBoard
    organization: TOrganization | null
    backend_url: string
}) {
    const updatedBoard = useRefresh(board, backend_url)

    const title = updatedBoard.meta?.title
        ? updatedBoard.meta.title + ' | Entur tavla'
        : 'Entur Tavla'

    useEffect(() => {
        const refreshTimeout = setTimeout(
            () => {
                window.location.reload()
            },
            24 * 60 * 60 * 1000,
        )

        return () => clearTimeout(refreshTimeout)
    }, [])

    return (
        <div>
            <style jsx global>
                {`
                    body {
                        background-color: ${updatedBoard.theme === 'dark'
                            ? 'black'
                            : 'white'};
                    }
                `}
            </style>

            <div className="root" data-theme={updatedBoard.theme ?? 'dark'}>
                <Head>
                    <title>{title}</title>
                </Head>
                <div className="rootContainer">
                    <Header
                        theme={updatedBoard.theme}
                        organizationLogo={organization?.logo}
                    />
                    <Board board={updatedBoard} />
                    <Footer
                        board={updatedBoard}
                        logo={organization?.logo !== undefined}
                        orgFooter={organization?.footer}
                    />
                </div>
            </div>
        </div>
    )
}

export default BoardPage
