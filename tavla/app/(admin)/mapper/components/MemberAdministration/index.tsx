'use client'
import { Paragraph } from '@entur/typography'
import { MemberList } from './MemberList'
import { TOrganization, TUser, TUserID } from 'types/settings'
import { InviteUser } from './InviteUser'
import { Modal } from '@entur/modal'
import { useState } from 'react'
import { Button } from '@entur/button'
import { UsersIcon } from '@entur/icons'

function MemberAdministration({
    folder,
    uid,
    members,
}: {
    folder: TOrganization
    uid: TUserID
    members: TUser[]
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
                    <MemberList oid={folder.id} uid={uid} members={members} />
                    <InviteUser oid={folder.id} />
                </div>
            </Modal>
        </>
    )
}

export { MemberAdministration }
