'use client'
import { Modal } from '@entur/modal'
import { useSearchParamsModal } from 'app/(admin)/hooks/useSearchParamsModal'
import { NameAndOrganizationSelector } from './NameAndOrganizationSelector'
import { Button } from '@entur/button'
import { BoardIcon } from '@entur/icons'
import Link from 'next/link'
import { TOrganization } from 'types/settings'

function CreateBoard({ folder }: { folder?: TOrganization }) {
    const [open, close] = useSearchParamsModal('board')

    return (
        <>
            <Button variant="secondary" as={Link} href="?board">
                Opprett tavle
                <BoardIcon aria-label="Tavle-ikon" />
            </Button>
            <Modal
                open={open}
                size="medium"
                onDismiss={() => close()}
                closeLabel="Avbryt opprettelse av tavle"
            >
                <NameAndOrganizationSelector folder={folder} />
            </Modal>
        </>
    )
}

export { CreateBoard }
