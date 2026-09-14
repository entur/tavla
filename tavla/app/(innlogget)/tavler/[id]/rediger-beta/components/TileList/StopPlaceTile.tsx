'use client'
import { SecondaryButton } from '@entur/button'
import { EditIcon } from '@entur/icons'
import { LeadParagraph } from '@entur/typography'
import { useLines } from 'app/_components/TileCard/useLines'
import TransportIcon from 'app/_components/TransportIcon/TransportIcon'
import { getTransportModesFromLines } from 'app/_components/TransportIcon/utils'
import { useState } from 'react'
import type { BoardTileDB } from 'src/types/db-types/boards'
import { DeleteTileButton } from './DeleteTileButton'
import { EditStopPlaceModal } from './EditStopPlaceModal'

export function StopPlaceTile({
    boardId,
    tile,
}: {
    boardId: string
    tile: BoardTileDB
}) {
    const [isEditOpen, setIsEditOpen] = useState(false)

    const quays = useLines(tile, true) ?? []

    const transportModes = getTransportModesFromLines(
        quays.flatMap(({ lines }) => lines),
    )

    return (
        <div className="flex items-center justify-between rounded bg-tintLight p-6">
            <div className="flex items-center gap-4">
                <LeadParagraph margin="none" className=" text-base md:text-lg">
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
                    onClick={() => setIsEditOpen(true)}
                    className="flex items-center gap-2 px-2 py-1"
                >
                    <EditIcon /> Rediger
                </SecondaryButton>
                <DeleteTileButton boardId={boardId} tile={tile} />
            </div>
            <EditStopPlaceModal
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
                tile={tile}
            />
        </div>
    )
}
