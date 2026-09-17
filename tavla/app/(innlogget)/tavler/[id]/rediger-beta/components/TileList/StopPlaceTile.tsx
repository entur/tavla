'use client'
import { SecondaryButton } from '@entur/button'
import { FeedbackText } from '@entur/form'
import { EditIcon } from '@entur/icons'
import { LeadParagraph } from '@entur/typography'
import TransportIcon from 'app/_components/TransportIcon/TransportIcon'
import { getTransportModesFromLines } from 'app/_components/TransportIcon/utils'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useState } from 'react'
import type { BoardDB, BoardTileDB } from 'src/types/db-types/boards'
import { EditStopPlaceModal } from '../EditStopPlaceModal/EditStopPlaceModal'
import { useLines } from '../utils/useLines'
import { DeleteTileButton } from './DeleteTileButton'

export function StopPlaceTile({
    board,
    tile,
}: {
    board: BoardDB
    tile: BoardTileDB
}) {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [deleteError, setDeleteError] = useState<string | undefined>()
    const { capture } = usePosthogTracking()

    const quays = useLines(tile, true) ?? []

    const transportModes = getTransportModesFromLines(
        quays.flatMap(({ lines }) => lines),
    )

    function handleSetIsEditOpen(open: boolean) {
        if (open) {
            capture('stop_place_edit_started', { location: 'edit_board_page' })
        } else {
            capture('stop_place_edit_cancelled', {
                location: 'edit_board_page',
                unsavedChanges: false,
            })
        }
        setIsEditOpen(open)
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between rounded bg-tintLight p-6">
                <div className="flex items-center gap-4">
                    <LeadParagraph
                        margin="none"
                        className=" text-base md:text-lg"
                    >
                        {tile.displayName ?? tile.name}
                    </LeadParagraph>
                    <div className="hidden md:flex md:gap-1">
                        {transportModes.map((mode) => (
                            <TransportIcon
                                key={`${mode.transportMode}|${mode.transportSubmode ?? ''}`}
                                transportMode={mode.transportMode}
                                transportSubmode={mode.transportSubmode}
                                background
                                whiteIcon
                                includeTooltip
                            />
                        ))}
                    </div>
                </div>
                <div className="flex gap-2">
                    <SecondaryButton
                        size="small"
                        onClick={() => handleSetIsEditOpen(true)}
                        className="flex items-center gap-2 px-2 py-1"
                    >
                        <EditIcon /> Rediger
                    </SecondaryButton>
                    <DeleteTileButton
                        boardId={board.id}
                        tile={tile}
                        onError={setDeleteError}
                    />
                </div>
                <EditStopPlaceModal
                    isOpen={isEditOpen}
                    setIsOpen={handleSetIsEditOpen}
                    tile={tile}
                    board={board}
                />
            </div>
            {deleteError && (
                <FeedbackText variant="negative">{deleteError}</FeedbackText>
            )}
        </div>
    )
}
