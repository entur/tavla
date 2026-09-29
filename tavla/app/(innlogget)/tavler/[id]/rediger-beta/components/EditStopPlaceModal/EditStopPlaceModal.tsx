'use client'
import { Modal } from '@entur/modal'
import { Heading3 } from '@entur/typography'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useState } from 'react'
import type { BoardDB, BoardTileDB } from 'src/types/db-types/boards'
import type { QuayWithFrontText } from '../utils/types'
import { TileContext } from './context'
import { EditStopPlaceForm } from './EditStopPlaceForm'

function EditStopPlaceModal({
    isOpen,
    setIsOpen,
    board,
    tile,
    quays,
}: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    board: BoardDB
    tile: BoardTileDB
    quays: QuayWithFrontText[] | null
}) {
    const { capture } = usePosthogTracking()

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [changedFields, setChangedFields] = useState<Set<string>>(new Set())

    const onFieldChanged = (field: string) => {
        setChangedFields((prev) => new Set(prev).add(field))
        setHasUnsavedChanges(true)
    }

    const close = () => {
        setHasUnsavedChanges(false)
        setChangedFields(new Set())
        setIsOpen(false)
    }

    const cancel = () => {
        capture('stop_place_edit_cancelled', {
            location: 'edit_board_page',
            unsavedChanges: hasUnsavedChanges,
        })
        close()
    }

    const quaysWithFilteredLines =
        quays?.filter((q) => q.lines.length > 0) ?? []

    return (
        <Modal
            open={isOpen}
            onDismiss={cancel}
            size="large"
            data-transport-palette={board.transportPalette}
        >
            <TileContext.Provider value={tile}>
                <Heading3 as="h1">
                    Rediger {tile.displayName ?? tile.name}
                </Heading3>

                {!quays ? (
                    <div>Laster...</div>
                ) : (
                    <EditStopPlaceForm
                        board={board}
                        tile={tile}
                        quays={quaysWithFilteredLines}
                        changedFields={changedFields}
                        onFieldChanged={onFieldChanged}
                        onSaved={close}
                        onCancel={cancel}
                    />
                )}
            </TileContext.Provider>
        </Modal>
    )
}

export { EditStopPlaceModal }
