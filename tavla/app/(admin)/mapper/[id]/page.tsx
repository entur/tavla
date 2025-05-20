import { Heading1, Label, Paragraph } from '@entur/typography'
import { getBoardsForOrganization } from 'app/(admin)/actions'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { getOrganization } from 'Board/scenarios/Board/firebase'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { TOrganizationID, TUser } from 'types/settings'
import { ButtonGroup } from '@entur/button'
import { FolderIcon } from '@entur/icons'
import { BoardTable } from 'app/(admin)/oversikt/components/BoardTable'
import { CreateBoard } from 'app/(admin)/components/CreateBoard'
import { BreadcrumbsNav } from '../../tavler/[id]/BreadcrumbsNav'
import { DeleteFolder } from 'app/(admin)/components/Delete'
import { UploadLogo } from '../components/UploadLogo'
import { MemberAdministration } from '../components/MemberAdministration'
import { auth } from 'firebase-admin'
import { UidIdentifier } from 'firebase-admin/lib/auth/identifier'
import EmptyOverview from 'app/(admin)/oversikt/components/EmptyOverview'

export type TProps = {
    params: Promise<{ id: TOrganizationID }>
}

export async function generateMetadata(props: TProps): Promise<Metadata> {
    const params = await props.params
    const { id } = params
    const folder = await getOrganization(id)

    if (!folder || !folder.id) {
        return notFound()
    }
    return {
        title: `${folder.name ?? 'Mappe'} | Entur Tavla`,
    }
}

async function FolderPage(props: TProps) {
    const user = await getUserFromSessionCookie()
    if (!user || !user.uid) return redirect('/')

    const params = await props.params
    const folder = await getOrganization(params.id)
    const boardCount = folder?.boards?.length

    if (!folder || !folder.id) {
        return notFound()
    }

    const boardsInFolder = await getBoardsForOrganization(folder.id)

    const owners = folder.owners ?? []

    const userRecords = await auth().getUsers(
        owners.map(
            (uid) =>
                ({
                    uid,
                }) as UidIdentifier,
        ),
    )

    const members = userRecords.users.map(
        (user) =>
            ({
                uid: user.uid,
                email: user.email,
            }) as TUser,
    )

    return (
        <div className="flex flex-col gap-4 container pb-20">
            <BreadcrumbsNav folder={folder} />
            <div className="flex flex-col lg:flex-row justify-between">
                <Heading1 className="flex flex-row gap-4 items-center">
                    <FolderIcon aria-label="Mappe-ikon" className="!top-0" />
                    {folder.name}
                </Heading1>
                <ButtonGroup>
                    <CreateBoard folder={folder} />
                    <UploadLogo folder={folder} />
                    <MemberAdministration
                        folder={folder}
                        uid={user.uid}
                        members={members}
                    />
                    <DeleteFolder organization={folder} type="button" />
                </ButtonGroup>
            </div>
            <Paragraph>
                Med en mappe kan du invitere andre til å administrere tavlene
                sammen med deg. Du kan også laste opp en logo, som vil vises i
                alle tavlene.
            </Paragraph>
            <div className="gap-4">
                {boardCount === 0 ? (
                    <EmptyOverview text="Her var det tomt gitt! Start med å opprette en tavle" />
                ) : (
                    <div className="flex flex-col">
                        <Label>Totalt antall tavler: {boardCount}</Label>
                        <BoardTable boards={boardsInFolder} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default FolderPage
