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

    const handleCloseModal = () => {
        setHasUnsavedChanges(false)
        setChangedFields(new Set())
        setIsOpen(false)
    }

    const discardChangesAndClose = () => {
        capture('stop_place_edit_cancelled', {
            location: 'edit_board_page',
            unsavedChanges: hasUnsavedChanges,
        })
        handleCloseModal()
    }

    const onSaved = () => {
        capture('stop_place_edit_saved', {
            location: 'board_page',
            name: changedFields.has('name'),
            offset: changedFields.has('offset'),
            offset_walking_dist: changedFields.has('offset_walking_dist'),
            columns: changedFields.has('columns'),
            lines: changedFields.has('lines'),
            transport_mode_filter: changedFields.has('transport_mode_filter'),
        })
        handleCloseModal()
    }

    const quaysWithFilteredLines =
        quays?.filter((q) => q.lines.length > 0) ?? []

    return (
        <Modal
            open={isOpen}
            onDismiss={discardChangesAndClose}
            size="large"
            className="!pb-0"
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
                        onFieldChanged={onFieldChanged}
                        onSaved={onSaved}
                        onCancel={discardChangesAndClose}
                    />
                )}
            </TileContext.Provider>
        </Modal>
    )
}

export { EditStopPlaceModal }
