'use client'
import { IconButton, PrimaryButton } from '@entur/button'
import { BoardIcon, CloseIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Folder } from 'app/(admin)/utils/types'
import { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useState } from 'react'
import { FolderDB } from 'src/types/db-types/folders'
import { NameAndFolderSelector } from './NameAndFolderSelector'

type CreateBoardProps = {
    trackingLocation: EventProps<'board_create_started'>['location']
    folder?: FolderDB
    folders?: Folder[]
}

function CreateBoard({ folders, folder, trackingLocation }: CreateBoardProps) {
    const [isOpen, setIsOpen] = useState(false)
    const posthog = usePosthogTracking()

    return (
        <>
            <PrimaryButton
                onClick={() => {
                    posthog.capture('board_create_started', {
                        location: trackingLocation,
                    })
                    setIsOpen(true)
                }}
            >
                Opprett tavle
                <BoardIcon />
            </PrimaryButton>
            <Modal
                open={isOpen}
                size="small"
                onDismiss={() => {
                    posthog.capture('board_create_cancelled', {
                        method: 'dismissed',
                    })
                    setIsOpen(false)
                }}
                closeLabel="Avbryt opprettelse av tavle"
                style={{ overflow: 'visible' }}
            >
                <IconButton
                    aria-label="Avbryt opprettelse av tavle"
                    onClick={() => {
                        posthog.capture('board_create_cancelled', {
                            method: 'close_icon',
                        })
                        setIsOpen(false)
                    }}
                    className="absolute right-4 top-4"
                >
                    <CloseIcon />
                </IconButton>
                <NameAndFolderSelector
                    folders={folders}
                    folder={folder}
                    onClose={() => {
                        posthog.capture('board_create_cancelled', {
                            method: 'cancel_button',
                        })
                        setIsOpen(false)
                    }}
                />
            </Modal>
        </>
    )
}

export { CreateBoard }
