import { Header } from 'components/Header'
import { TBoard, TLogoUrl } from 'types/settings'
import classes from 'styles/pages/board.module.css'
import { upgradeBoard } from 'utils/converters'
import { Board } from 'Board/scenarios/Board'
import { getBoard, getOrganizationLogoWithBoard } from 'Admin/utils/firebase'
import { useUpdateLastActive } from 'hooks/useUpdateLastActive'
import { Footer } from 'components/Footer'

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
            logo: board.id && (await getOrganizationLogoWithBoard(board.id)), //'https://firebasestorage.googleapis.com/v0/b/entur-tavla-staging.appspot.com/o/images%2Fskyss_logg_logo.png?alt=media&token=ff143f71-7500-47e9-80ee-79e1920f6bef&_gl=1*16kfrjn*_ga*MTI1MzgwMDAyNi4xNjkyMzQ3MTA2*_ga_CW55HF8NVT*MTY5ODA1NjE2Ny41My4xLjE2OTgwNTYxOTUuMzIuMC4w',
        },
    }
}

function BoardPage({ board, logo }: { board: TBoard; logo: TLogoUrl }) {
    useUpdateLastActive(board.id)
    return (
        <div className={classes.root} data-theme={board.theme ?? 'dark'}>
            <div className={classes.rootContainer}>
                <Header theme={board.theme} logo={logo} />
                <Board board={board} />
                {logo && <Footer />}
            </div>
        </div>
    )
}

export default BoardPage
