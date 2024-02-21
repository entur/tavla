import { Header } from 'components/Header'
import { TBoard, TLogo } from 'types/settings'
import classes from 'styles/pages/board.module.css'
import { Board } from 'Board/scenarios/Board'
import { getBoard, getOrganizationLogoWithBoard } from 'Admin/utils/firebase'
import { useUpdateLastActive } from 'hooks/useUpdateLastActive'
import { Footer } from 'components/Footer'
import { defaultFontSize, getFontScale } from 'Board/scenarios/Board/utils'

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

    return (
        <div className={classes.root} data-theme={board.theme ?? 'dark'}>
            <div
                className={classes.rootContainer}
                style={{
                    fontSize:
                        100 *
                            getFontScale(
                                board?.meta?.fontSize || defaultFontSize(board),
                            ) +
                        '%',
                }}
            >
                <Header
                    theme={board.theme}
                    organizationLogo={organizationLogo}
                    showTitle={board.meta?.showTitle ?? false}
                    title={board.meta.title}
                />
                <Board board={board} />
                {organizationLogo && <Footer />}
            </div>
        </div>
    )
}

export default BoardPage
