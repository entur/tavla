import { getBoard, getOrganizationLogoWithBoard } from 'Admin/utils/firebase'
import { notFound } from 'next/navigation'
import { TBoard } from 'types/settings'
import { upgradeBoard } from 'utils/converters'
import classes from 'styles/pages/board.module.css'
import { Header } from 'components/Header'
import { Board } from 'Board/scenarios/Board'
import { Footer } from 'components/Footer'
import { Pinger } from 'components/Pinger'

async function BoardPage({ params }: { params: { id: string } }) {
    const { id } = params

    let board: TBoard | undefined = await getBoard(id)

    if (!board) return notFound()

    board = upgradeBoard(board)
    const organizationLogo = await getOrganizationLogoWithBoard(board.id ?? '')

    return (
        <div className={classes.root} data-theme={board.theme ?? 'dark'}>
            <div className={classes.rootContainer}>
                <Header
                    theme={board.theme}
                    organizationLogo={organizationLogo}
                />
                <Board board={board} />
                {organizationLogo && <Footer />}
            </div>
            <Pinger boardId={board.id} />
        </div>
    )
}

export default BoardPage
