'use client'
import { PrimaryButton } from '@entur/button'
import { BoardIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { useState } from 'react'
import { TFolder } from 'types/settings'
import { NameAndFolderSelector } from './NameAndFolderSelector'

function CreateBoard({ folder }: { folder?: TFolder }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <PrimaryButton onClick={() => setIsOpen(true)}>
                Opprett tavle
                <BoardIcon aria-label="Tavle-ikon" />
            </PrimaryButton>
            <Modal
                open={isOpen}
                size="medium"
                onDismiss={() => setIsOpen(false)}
                closeLabel="Avbryt opprettelse av tavle"
                style={{ overflow: 'visible' }}
            >
                <NameAndFolderSelector folder={folder} />
            </Modal>
        </>
    )
}

export { CreateBoard }
