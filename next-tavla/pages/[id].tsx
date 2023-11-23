import { Header } from 'components/Header'
import { TBoard, TLogo } from 'types/settings'
import classes from 'styles/pages/board.module.css'
import { upgradeBoard } from 'utils/converters'
import { Board } from 'Board/scenarios/Board'
import {
    getBoard,
    getOrganizationFooterWithBoard,
    getOrganizationLogoWithBoard,
} from 'Admin/utils/firebase'
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
            organizationLogo: await getOrganizationLogoWithBoard(id),
            organizationFooterInfo: await getOrganizationFooterWithBoard(id),
        },
    }
}

function BoardPage({
    board,
    organizationLogo,
    organizationFooterInfo,
}: {
    board: TBoard
    organizationLogo: TLogo | null
    organizationFooterInfo: string | null
}) {
    useUpdateLastActive(board.id)

    return (
        <div className={classes.root} data-theme={board.theme ?? 'dark'}>
            <div className={classes.rootContainer}>
                <Header
                    theme={board.theme}
                    organizationLogo={organizationLogo}
                />
                <Board board={board} />
                <div className="flexRow justifyLeft alignCenter text-rem-3">
                    {organizationLogo && <Footer />}
                    {organizationFooterInfo && (
                        <OrganizationInfoFooter
                            description={organizationFooterInfo ?? ''}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default BoardPage
