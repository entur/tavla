import { Header } from 'components/Header'
import { TBoard } from 'types/settings'
import classes from 'styles/pages/board.module.css'
import { upgradeBoard } from 'utils/converters'
import { Board } from 'Board/scenarios/Board'
import { getBoard } from 'Admin/utils/firebase'
import { useUpdateLastActive } from 'hooks/useUpdateLastActive'

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

    const convertedBoard = upgradeBoard(board)

    return {
        props: {
            board: convertedBoard,
        },
    }
}

function BoardPage({ board }: { board: TBoard }) {
    useUpdateLastActive(board.id)
    return (
        <div className={classes.root} data-theme={board.theme ?? 'dark'}>
            <div className={classes.rootContainer}>
                <Header theme={board.theme} />
                <Board board={board} />
            </div>
        </div>
    )
}

export default BoardPage
