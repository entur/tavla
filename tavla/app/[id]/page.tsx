import { TBoard, TBoardID } from 'types/settings'
import {
    getBoard,
    getOrganizationWithBoard,
} from 'Board/scenarios/Board/firebase'
import { getBackendUrl } from 'utils/index'
import BoardPage from 'app/components/BoardPage'

export type TProps = {
    params: Promise<{ id: TBoardID }>
}

export default async function Board({ params }: { params: { id: string } }) {
    const { id } = params
    const board: TBoard | undefined = await getBoard(id)

    if (!board) {
        return {
            notFound: true,
        }
    }

    const organization = await getOrganizationWithBoard(id)
    return (
        <BoardPage
            board={board}
            organization={organization}
            backend_url={getBackendUrl()}
        />
    )
}
