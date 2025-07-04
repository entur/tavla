'use client'
import { Modal } from '@entur/modal'
import { NameAndFolderSelector } from './NameAndFolderSelector'
import { PrimaryButton } from '@entur/button'
import { BoardIcon } from '@entur/icons'
import { TFolder } from 'types/settings'
import { useModalWithValues } from 'app/(admin)/oversikt/hooks/useModalWithValue'

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
