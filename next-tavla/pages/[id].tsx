import { Header } from 'components/Header'
import { TBoard, TLogo } from 'types/settings'
import { Board } from 'Board/scenarios/Board'
import {
    getBoard,
    getOrganizationFooterWithBoard,
    getOrganizationLogoWithBoard,
} from 'Board/scenarios/Board/firebase'
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

    return {
        props: {
            board,
            organizationLogo: await getOrganizationLogoWithBoard(id),
            organizationFooter: await getOrganizationFooterWithBoard(id),
        },
    }
}

function BoardPage({
    board,
    organizationLogo,
    organizationFooter,
}: {
    board: TBoard
    organizationLogo: TLogo | null
    organizationFooter: string | undefined
}) {
    useUpdateLastActive(board.id)

    return (
        <div className="root" data-theme={board.theme ?? 'dark'}>
            <div className="rootContainer">
                <Header
                    theme={board.theme}
                    organizationLogo={organizationLogo}
                />
                <Board board={board} />
                <Footer
                    logo={organizationLogo !== null}
                    footer={board.footer ?? organizationFooter}
                />
            </div>
        </div>
    )
}

export default BoardPage
