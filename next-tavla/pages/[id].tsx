import { Header } from 'components/Header'
import { TBoard, TOrganization } from 'types/settings'
import { Board } from 'Board/scenarios/Board'
import {
    getBoard,
    getOrganizationWithBoard,
} from 'Board/scenarios/Board/firebase'
import { useUpdateLastActive } from 'hooks/useUpdateLastActive'
import { Footer } from 'components/Footer'
import { defaultFontSize, getFontScale } from 'Board/scenarios/Board/utils'

export async function getServerSideProps({
    params,
}: {
    params: { id: string }
}) {
    const { id } = params

    const board: TBoard | undefined = await getBoard(id)

    if (!board) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            board,
            organization: await getOrganizationWithBoard(id),
        },
    }
}

function BoardPage({
    board,
    organization,
}: {
    board: TBoard
    organization: TOrganization | null
}) {
    useUpdateLastActive(board.id)
    return (
        <div className="root" data-theme={board.theme ?? 'dark'}>
            <div className="rootContainer">
                <Header
                    theme={board.theme}
                    organizationLogo={organization?.logo}
                />
                <Board board={board} />
                <Footer
                    theme={board.theme ?? 'dark'}
                    logo={organization?.logo !== undefined}
                    footer={
                        organization?.footer && board.footer?.override !== true
                            ? organization.footer
                            : board.footer?.footer
                    }
                    fontSize={
                        getFontScale(board.meta?.fontSize) ||
                        defaultFontSize(board)
                    }
                />
            </div>
        </div>
    )
}

export default BoardPage
