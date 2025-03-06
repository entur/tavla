import { Heading1, Paragraph } from '@entur/typography'
import { getBoardsForOrganization } from 'app/(admin)/actions'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { getOrganizationById } from 'Board/scenarios/Board/firebase'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { TOrganizationID } from 'types/settings'
import { Button } from '@entur/button'
import { BackArrowIcon, EditIcon, FolderIcon } from '@entur/icons'
import Link from 'next/link'
import { BoardTable } from '../components/BoardTable'

export type TProps = {
    params: Promise<{ id: TOrganizationID }>
}

export async function generateMetadata(props: TProps): Promise<Metadata> {
    const params = await props.params
    const { id } = params
    const folder = await getOrganizationById(id)

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
    const folder = await getOrganizationById(params.id)

    if (!folder || !folder.id) {
        return notFound()
    }

    const boardsInFolder = await getBoardsForOrganization(folder.id)

    return (
        <div className="flex flex-col gap-4 container pb-20">
            <p className="flex flex-row gap-2 items-center">
                <BackArrowIcon className="!top-0" aria-label="Tilbake-ikon" />
                <Link href="/boards" className="underline">
                    Mapper og tavler
                </Link>
            </p>
            <div className="flex flex-row justify-between">
                <Heading1 className="flex flex-row gap-4">
                    <FolderIcon aria-label="Mappe-ikon" />
                    {folder.name}
                </Heading1>
                <Button
                    variant="secondary"
                    as={Link}
                    href={`/folders/${folder.id}`}
                >
                    Rediger <EditIcon aria-label="Rediger-ikon" />
                </Button>
            </div>
            <Paragraph>
                Med en mappe kan du invitere andre til å administrere tavlene
                sammen med deg. Du kan også laste opp en logo, som vil vises i
                alle tavlene.
            </Paragraph>
            <BoardTable boards={boardsInFolder} />
        </div>
    )
}

export default FolderPage
