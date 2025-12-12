'use client'
import { PrimaryButton } from '@entur/button'
import { BoardIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { useState } from 'react'
import { FolderDB } from 'types/db-types/folders'
import { NameAndFolderSelector } from './NameAndFolderSelector'

function CreateBoard({ folder }: { folder?: FolderDB }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <PrimaryButton onClick={() => setIsOpen(true)}>
                Opprett tavle
                <BoardIcon />
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
