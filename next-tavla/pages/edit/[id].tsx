import { Edit } from 'Admin/scenarios/Edit'
import { TBoard } from 'types/settings'
import { getBoard } from 'utils/firebase'
import classes from 'styles/pages/admin.module.css'
import { Contrast } from '@entur/layout'
import { upgradeBoard } from 'utils/converters'
import { ToastProvider } from '@entur/alert'
import { IncomingNextMessage } from 'types/next'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { AdminHeader } from 'Admin/scenarios/AdminHeader'
import { verifyUserSession } from 'Admin/utils/auth'

export async function getServerSideProps({
    params,
    req,
}: {
    params: { id: string }
    req: IncomingNextMessage
}) {
    const { id } = params

    const user = await verifyUserSession(req)
    if (!user)
        return {
            redirect: {
                destination: '/#login',
                permanent: false,
            },
        }

    const board: TBoard | undefined = await getBoard(id)

    if (!board) {
        return {
            notFound: true,
        }
    }

    const convertedBoard = upgradeBoard(board)

    return {
        props: {
            user: user,
            board: convertedBoard,
            id,
        },
    }
}

function AdminPage({
    user,
    board,
    id,
}: {
    user: DecodedIdToken | null
    board: TBoard
    id: string
}) {
    return (
        <Contrast className={classes.root}>
            <ToastProvider>
                <AdminHeader user={user} />
                <Edit initialBoard={board} documentId={id} user={user} />
            </ToastProvider>
        </Contrast>
    )
}

export default AdminPage
