import classes from 'styles/pages/admin.module.css'
import { Contrast } from '@entur/layout'
import { ToastProvider } from '@entur/alert'
import { Boards } from 'Admin/scenarios/Boards'
import { TBoard, TOrganization, TOrganizationID } from 'types/settings'
import {
    getBoardsForOrganization,
    getOrganizationsWithUser,
} from 'Admin/utils/firebase'
import { verifyUserSession } from 'Admin/utils/auth'
import { IncomingNextMessage } from 'types/next'
import { AdminHeader } from 'Admin/components/AdminHeader'
import { SelectOrganization } from 'Admin/scenarios/Boards/components/SelectOrganization'
import TavlaHead from 'components/TavlaHead'

export async function getServerSideProps({
    params,
    req,
}: {
    params: { id: string }
    req: IncomingNextMessage
}) {
    const { id } = params
    const user = await verifyUserSession(req)
    if (!user) {
        return {
            redirect: {
                destination: '/#login',
                permanent: false,
            },
        }
    }
    const boards = await getBoardsForOrganization(id)
    const organizations = await getOrganizationsWithUser(user.uid)

    return {
        props: {
            boards: boards,
            organizations: organizations,
            oid: id,
        },
    }
}

function OverviewPageForOrganization({
    boards,
    organizations,
    oid,
}: {
    boards: TBoard[]
    organizations: TOrganization[]
    oid: TOrganizationID
}) {
    const organizationName =
        organizations.find((org) => org.id === oid)?.name ?? 'Organisasjon'

    return (
        <div className={classes.root}>
            <TavlaHead
                title={`Tavler (${organizationName})`}
                description={`Tabell med tavler som tilhører ${organizationName}`}
            />
            <AdminHeader loggedIn />
            <Contrast className={classes.body}>
                <ToastProvider>
                    <div className="flexRow g-3 h-100">
                        <SelectOrganization
                            organizations={organizations}
                            activeId={oid}
                        />
                        <Boards boards={boards} />
                    </div>
                </ToastProvider>
            </Contrast>
        </div>
    )
}

export default OverviewPageForOrganization
