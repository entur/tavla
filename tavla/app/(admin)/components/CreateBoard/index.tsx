'use client'
import { PrimaryButton } from '@entur/button'
import { BoardIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { usePostHog } from 'posthog-js/react'
import { useState } from 'react'
import { FolderDB } from 'src/types/db-types/folders'
import { NameAndFolderSelector } from './NameAndFolderSelector'

type CreateBoardProps = {
    trackingEvent: string
    folder?: FolderDB
}

function CreateBoard({ folder, trackingEvent }: CreateBoardProps) {
    const [isOpen, setIsOpen] = useState(false)
    const posthog = usePostHog()

    return (
        <>
            <PrimaryButton
                onClick={() => {
                    posthog.capture(trackingEvent)
                    setIsOpen(true)
                }}
            >
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
