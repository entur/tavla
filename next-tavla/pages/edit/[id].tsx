import { Edit } from 'Admin/scenarios/Edit'
import { TBoard } from 'types/settings'
import classes from 'styles/pages/admin.module.css'
import { Contrast } from '@entur/layout'
import { upgradeBoard } from 'utils/converters'
import { ToastProvider } from '@entur/alert'
import { IncomingNextMessage } from 'types/next'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { verifyUserSession } from 'Admin/utils/auth'
import { getBoard } from 'Admin/utils/firebase'
import { AdminHeader } from 'Admin/components/AdminHeader'

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
                <Edit initialBoard={board} documentId={id} user={user} />
            </ToastProvider>
        </Contrast>
            <AdminHeader user={user} options={['boards', 'create']} />
    )
}

export default AdminPage
