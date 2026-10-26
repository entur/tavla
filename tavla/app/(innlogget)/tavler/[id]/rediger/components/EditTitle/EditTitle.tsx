'use client'
import { IconButton } from '@entur/button'
import { EditIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useState } from 'react'
import type { BoardDB } from 'src/types/db-types/boards'
import { EditTitleForm } from './EditTitleForm'

export function EditBoardTitle({
    board,
    trackingLocation,
}: {
    board: BoardDB
    trackingLocation: EventProps<'board_name_edit_started'>['location']
}) {
    const { capture } = usePosthogTracking()
    const [open, setOpen] = useState(false)

    const closeModal = (method: 'dismissed' | 'cancel_button') => {
        capture('board_name_edit_cancelled', {
            location: trackingLocation,
            method,
        })
        setOpen(false)
    }

    return (
        <>
            <IconButton
                aria-label="Endre navn på tavla"
                className="gap-2"
                onClick={() => {
                    capture('board_name_edit_started', {
                        location: trackingLocation,
                    })
                    setOpen(true)
                }}
            >
                <EditIcon />
                Endre navn
            </IconButton>
            <Modal
                open={open}
                size="small"
                onDismiss={() => closeModal('dismissed')}
                closeLabel="Avbryt"
                title="Endre navn på Tavla"
            >
                <EditTitleForm
                    bid={board.id}
                    currentTitle={board.meta.title ?? ''}
                    onSuccess={() => setOpen(false)}
                    onCancel={() => closeModal('cancel_button')}
                    trackingLocation={trackingLocation}
                />
            </Modal>
        </>
    )
}
