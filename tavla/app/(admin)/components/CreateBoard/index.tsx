'use client'
import { PrimaryButton } from '@entur/button'
import { BoardIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { useModalWithValues } from 'app/(admin)/oversikt/hooks/useModalWithValue'
import { TFolder } from 'types/settings'
import { NameAndFolderSelector } from './NameAndFolderSelector'

function CreateBoard({ folder }: { folder?: TFolder }) {
    const { isOpen, open, close } = useModalWithValues({
        key: 'opprett',
        value: 'tavle',
    })

    return (
        <>
            <PrimaryButton onClick={open}>
                Opprett tavle
                <BoardIcon aria-label="Tavle-ikon" />
            </PrimaryButton>
            <Modal
                open={isOpen}
                size="medium"
                onDismiss={() => close()}
                closeLabel="Avbryt opprettelse av tavle"
            >
                <NameAndFolderSelector folder={folder} />
            </Modal>
        </>
    )
}

export { CreateBoard }
