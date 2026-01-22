'use client'
import { IconButton, PrimaryButton } from '@entur/button'
import { BoardIcon, CloseIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { usePostHog } from 'posthog-js/react'
import { useState } from 'react'
import { FolderDB } from 'types/db-types/folders'
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
                size="small"
                onDismiss={() => setIsOpen(false)}
                closeLabel="Avbryt opprettelse av tavle"
                style={{ overflow: 'visible' }}
            >
                <IconButton
                    aria-label="Avbryt opprettelse av tavle"
                    onClick={() => setIsOpen(false)}
                    className="absolute right-4 top-4"
                >
                    <CloseIcon />
                </IconButton>
                <NameAndFolderSelector
                    folder={folder}
                    onClose={() => setIsOpen(false)}
                />
            </Modal>
        </>
    )
}

export { CreateBoard }
