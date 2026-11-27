'use client'
import { Modal } from '@entur/modal'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useState } from 'react'
import type { BoardDB, BoardTileDB } from 'src/types/db-types/boards'
import type { TQuayFragment } from 'types/operations'
import { useQuaysWithFrontTexts } from '../utils/useQuaysWithFrontTexts'
import { TileContext } from './context'
import { EditStopPlaceForm } from './EditStopPlaceForm'

function EditStopPlaceModal({
    isOpen,
    setIsOpen,
    board,
    tile,
    quays,
    trackingLocation,
}: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    board: BoardDB
    tile: BoardTileDB
    quays: TQuayFragment[] | null
    trackingLocation: EventProps<'stop_place_edit_cancelled'>['location']
}) {
    const { capture } = usePosthogTracking()

    const [hasOpened, setHasOpened] = useState(false)
    if (isOpen && !hasOpened) setHasOpened(true)

    const { quaysWithFrontTexts, hasError } = useQuaysWithFrontTexts(
        quays,
        !!board.isArrivals,
        hasOpened,
    )

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
            location: trackingLocation,
            unsavedChanges: hasUnsavedChanges,
        })
        handleCloseModal()
    }

    const onSaved = () => {
        capture('stop_place_edit_saved', {
            location: trackingLocation,
            name: changedFields.has('name'),
            offset: changedFields.has('offset'),
            offset_walking_dist: changedFields.has('offset_walking_dist'),
            columns: changedFields.has('columns'),
            view_mode: changedFields.has('view_mode'),
            quays_filter: changedFields.has('quays_filter'),
            stop_place_filter: changedFields.has('stop_place_filter'),
            filter_mode: changedFields.has('filter_mode'),
        })
        handleCloseModal()
    }

    const quaysWithFilteredLines =
        quaysWithFrontTexts?.filter((q) => q.lines.length > 0) ?? []

    return (
        <Modal
            open={isOpen}
            onDismiss={discardChangesAndClose}
            size="large"
            className="!pb-0"
            data-transport-palette={board.transportPalette}
            title={`Rediger ${tile.displayName ?? tile.name}`}
        >
            <TileContext.Provider value={tile}>
                {!quaysWithFrontTexts ? (
                    <div className="h-screen my-8">Laster...</div>
                ) : (
                    <EditStopPlaceForm
                        board={board}
                        tile={tile}
                        quays={quaysWithFilteredLines}
                        linesUnavailable={hasError}
                        onFieldChanged={onFieldChanged}
                        onSaved={onSaved}
                        onCancel={discardChangesAndClose}
                        trackingLocation={trackingLocation}
                    />
                )}
            </TileContext.Provider>
        </Modal>
    )
}

export { EditStopPlaceModal }
