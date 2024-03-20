import { Header } from 'components/Header'
import { TBoard, TOrganization } from 'types/settings'
import { Board } from 'Board/scenarios/Board'
import {
    getBoard,
    getOrganizationWithBoard,
} from 'Board/scenarios/Board/firebase'
import { useUpdateLastActive } from 'hooks/useUpdateLastActive'
import { Footer } from 'components/Footer'
import { useRefresh } from 'hooks/useRefresh'

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
    useRefresh(board.id)

    return (
        <div className="root" data-theme={board.theme ?? 'dark'}>
            <div className="rootContainer">
                <Header
                    theme={board.theme}
                    organizationLogo={organization?.logo}
                />
                <Board board={board} />
                <Footer
                    board={board}
                    logo={organization?.logo !== undefined}
                    orgFooter={organization?.footer}
                />
            </div>
        </div>
    )
}

export default BoardPage
