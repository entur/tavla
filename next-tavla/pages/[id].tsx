import { Header } from 'components/Header'
import { TBoard } from 'types/settings'
import { getBoard } from 'utils/firebase'
import classes from 'styles/pages/board.module.css'
import { upgradeBoard } from 'utils/converters'
import { Board } from 'Board/scenarios/Board'

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
    return (
        <div className={classes.root} data-theme={board.theme || 'dark'}>
            <div className={classes.rootContainer}>
                <Header theme={board.theme} showClock={true} />
                <Board board={board} />
            </div>
        </div>
    )
}

export default BoardPage
