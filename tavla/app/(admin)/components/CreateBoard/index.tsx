'use client'
import { Modal } from '@entur/modal'
import { useSearchParamsModal } from 'app/(admin)/hooks/useSearchParamsModal'
import { NameAndOrganizationSelector } from './NameAndOrganizationSelector'

function CreateBoard() {
    const [open, close] = useSearchParamsModal('board')

    return (
        <>
            <Modal
                open={open}
                size="medium"
                onDismiss={() => close()}
                closeLabel="Avbryt opprettelse av tavle"
            >
                <NameAndOrganizationSelector />
            </Modal>
        </>
    )
}

export { CreateBoard }
