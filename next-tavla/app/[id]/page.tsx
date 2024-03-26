import { getBoard, getOrganizationWithBoard } from 'app/(admin)/utils/firebase'
import { TBoardID } from 'types/settings'
import classes from 'styles/pages/board.module.css'
import { notFound } from 'next/navigation'
import { Header } from 'components/Header'
import { Board } from 'Board/scenarios/Board'
import { Footer } from 'components/Footer'

async function BoardPage({ params }: { params: { id: TBoardID } }) {
    // useUpdateLastActive(board.id)
    const board = await getBoard(params.id)
    const logo = await getOrganizationWithBoard(params.id).then((o) => o?.logo)
    if (!board) return notFound

    return (
        <div className={classes.root} data-theme={board.theme ?? 'dark'}>
            <div className={classes.rootContainer}>
                <Header theme={board.theme} organizationLogo={logo} />
                <Board board={board} />
                {logo && <Footer />}
            </div>
        </div>
    )
}

export default BoardPage
