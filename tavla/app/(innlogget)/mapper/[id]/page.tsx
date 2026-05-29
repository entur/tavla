import { ButtonGroup } from '@entur/button'
import { FolderIcon } from '@entur/icons'
import { Heading1, Label, Paragraph } from '@entur/typography'
import { getBoardsForFolder } from 'app/(innlogget)/actions'
import { CreateBoard } from 'app/(innlogget)/components/CreateBoard/CreateBoard'
import { DeleteFolder } from 'app/(innlogget)/components/DeleteFolder/DeleteFolder'
import { BoardTable } from 'app/(innlogget)/oversikt/components/BoardTable'
import EmptyOverview from 'app/(innlogget)/oversikt/components/EmptyOverview'
import { BreadcrumbsNav } from 'app/(innlogget)/tavler/[id]/BreadcrumbsNav'
import { getUserFromSessionCookie } from 'app/(innlogget)/utils/server'
import { FeatureFlags } from 'app/posthog/featureFlags'
import { isFeatureEnabled } from 'app/posthog/nodePosthogClient'
import { auth } from 'firebase-admin'
import type { UserIdentifier } from 'firebase-admin/auth'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getFolder } from 'src/firebase'
import type { FolderDB } from 'src/types/db-types/folders'
import type { UserDB } from 'src/types/db-types/users'
import { MemberAdministration } from '../components/MemberAdministration/MemberAdministration'
import { UploadLogo } from '../components/UploadLogo/UploadLogo'

export type TProps = {
    params: Promise<{ id: FolderDB['id'] }>
}

export async function generateMetadata(props: TProps): Promise<Metadata> {
    const params = await props.params
    const { id } = params
    const folder = await getFolder(id)

    if (!folder || !folder.id) {
        return notFound()
    }
    return {
        title: `${folder.name ?? 'Mappe'} | Entur Tavla - Sanntidsskjerm og avgangstavle for offentlig kollektivtransport`,
        description: `Se og administrer tavler i mappen ${folder.name ?? 'Mappe'}. Inviter andre til å samarbeide, last opp en logo og mer.`,
    }
}

export type AuthenticatedUser = {
    uid: UserDB['uid']
    email?: string
}

async function getAuthenticatedUsers(
    uids: UserDB['uid'][],
): Promise<AuthenticatedUser[]> {
    const userIdentifiers: UserIdentifier[] = uids.map((uid) => ({ uid }))
    const userRecords = await auth().getUsers(userIdentifiers)

    const members: AuthenticatedUser[] = userRecords.users.map((user) => ({
        uid: user.uid,
        email: user.email,
    }))
    return members
}

async function FolderPage(props: TProps) {
    const user = await getUserFromSessionCookie()
    if (!user || !user.uid) return redirect('/')

    const params = await props.params
    const folder = await getFolder(params.id)
    if (!folder || !folder.id) {
        return notFound()
    }
    const boardsInFolder = await getBoardsForFolder(folder.id)

    const owners: UserDB['uid'][] = folder.owners ?? []

    const members: AuthenticatedUser[] = await getAuthenticatedUsers(owners)

    const isArrival = await isFeatureEnabled(
        FeatureFlags.ARRIVAL_DEPARTURE_BOARD,
    )

    return (
        <main id="main-content" className="container flex flex-col gap-4 pb-20">
            <BreadcrumbsNav type="folder" folder={folder} />
            <div className="flex flex-col justify-between lg:flex-row">
                <Heading1 className="flex flex-row items-center gap-4">
                    <FolderIcon aria-label="Mappe-ikon" className="!top-0" />
                    {folder.name}
                </Heading1>
                <ButtonGroup>
                    <CreateBoard
                        folder={folder}
                        trackingLocation="folder"
                        showArrivalDeparture={isArrival}
                    />
                    <UploadLogo folder={folder} />
                    <MemberAdministration
                        folder={folder}
                        uid={user.uid}
                        members={members}
                    />
                    <DeleteFolder folder={folder} type="button" />
                </ButtonGroup>
            </div>
            <Paragraph>
                Med en mappe kan du invitere andre til å administrere tavlene
                sammen med deg. Du kan også laste opp en logo, som vil vises i
                alle tavlene.
            </Paragraph>
            <div className="gap-4">
                {boardsInFolder.length === 0 ? (
                    <EmptyOverview text="Her var det tomt gitt! Start med å opprette en tavle" />
                ) : (
                    <div className="flex flex-col">
                        <Label>Antall tavler: {boardsInFolder.length}</Label>
                        <BoardTable boards={boardsInFolder} />
                    </div>
                )}
            </div>
        </main>
    )
}

export default FolderPage
