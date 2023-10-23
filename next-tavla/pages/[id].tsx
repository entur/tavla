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
            logo: await getOrganizationLogoWithBoard(id),
        },
    }
}

function BoardPage({ board, logo }: { board: TBoard; logo: TLogoUrl }) {
    useUpdateLastActive(board.id)
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
