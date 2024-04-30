import { Header } from 'components/Header'
import { TBoard, TOrganization } from 'types/settings'
import { Board } from 'Board/scenarios/Board'
import {
    getBoard,
    getOrganizationWithBoard,
} from 'Board/scenarios/Board/firebase'
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
    const updatedBoard = useRefresh(board)

    return (
        <div className="root" data-theme={updatedBoard.theme ?? 'dark'}>
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
    )
}

export default BoardPage
