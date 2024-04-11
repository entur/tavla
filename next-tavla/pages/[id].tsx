import { Header } from 'components/Header'
import { TBoard, TLogo, TOrganization } from 'types/settings'
import { Board } from 'Board/scenarios/Board'
import {
    getBoard,
    getOrganizationWithBoard,
} from 'Board/scenarios/Board/firebase'
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
            organization: await getOrganizationWithBoard(id),
        },
    }
}

function BoardPage({
    board,
    organization,
}: {
    board: TBoard
    organization: TOrganization | undefined
}) {
    useUpdateLastActive(board.id)

    return (
        <div className="root" data-theme={board.theme ?? 'dark'}>
            <div className="rootContainer">
                <Header
                    theme={board.theme}
                    organizationLogo={organization?.logo}
                />
                <Board board={board} />
                <Footer
                    logo={organization?.logo !== undefined}
                    footer={board.footer ?? organization?.footer}
                    style={{
                        fontSize:
                            100 *
                                getFontScale(
                                    board.meta?.fontSize ||
                                        defaultFontSize(board),
                                ) +
                            '%',
                    }}
                />
            </div>
        </div>
    )
}

export default BoardPage
