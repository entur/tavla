'use client'
import { Button } from '@entur/button'
import { UsersIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Paragraph } from '@entur/typography'
import { AuthenticatedUser } from 'app/(admin)/mapper/[id]/page'
import { useState } from 'react'
import { FolderDB } from 'src/types/db-types/folders'
import { UserDB } from 'src/types/db-types/users'
import { InviteUser } from './InviteUser'
import { MemberList } from './MemberList'

function MemberAdministration({
    folder,
    uid,
    members,
}: {
    folder: FolderDB
    uid: UserDB['uid']
    members: AuthenticatedUser[]
}) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setIsOpen(true)} variant="secondary">
                Administrer medlemmer
                <UsersIcon />
            </Button>
            <Modal
                title="Administrer medlemmer"
                open={isOpen}
                onDismiss={() => setIsOpen(false)}
                size="medium"
            >
                <Paragraph>
                    Administrer hvem som skal ha tilgang til tavlene i denne
                    mappen. Du kan kun legge til medlemmer som har opprettet en
                    bruker på Tavla.
                </Paragraph>
                <div className="flex flex-col gap-6">
                    <MemberList
                        folderid={folder.id}
                        uid={uid}
                        members={members}
                    />
                    <InviteUser folderid={folder.id} />
                </div>
            </Modal>
        </>
    )
}

export { MemberAdministration }
