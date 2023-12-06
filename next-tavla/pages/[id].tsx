import { Header } from 'components/Header'
import { TBoard, TLogo } from 'types/settings'
import classes from 'styles/pages/board.module.css'
import { upgradeBoard } from 'utils/converters'
import { Board } from 'Board/scenarios/Board'
import { getBoard, getOrganizationLogoWithBoard } from 'Admin/utils/firebase'
import { useUpdateLastActive } from 'hooks/useUpdateLastActive'
import { Footer } from 'components/Footer'
import TavlaHead from 'components/TavlaHead'
import { DEFAULT_BOARD_NAME } from 'Admin/utils/constants'

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
            organizationLogo: await getOrganizationLogoWithBoard(id),
        },
    }
}

function BoardPage({
    board,
    organizationLogo,
}: {
    board: TBoard
    organizationLogo: TLogo | null
}) {
    useUpdateLastActive(board.id)

    const boardName = board.meta?.title ?? DEFAULT_BOARD_NAME

    return (
        <div className={classes.root} data-theme={board.theme ?? 'dark'}>
            <TavlaHead
                title={boardName}
                description={`Tavlevisning for ${boardName}`}
            />
            <div className={classes.rootContainer}>
                <Header
                    theme={board.theme}
                    organizationLogo={organizationLogo}
                />
                <Board board={board} />
                {organizationLogo && <Footer />}
            </div>
        </div>
    )
}

export default BoardPage
