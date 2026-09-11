'use client'
import { Button } from '@entur/button'
import { Modal } from '@entur/modal'
import { Heading2 } from '@entur/typography'
import type { BoardTileDB } from 'src/types/db-types/boards'

function EditStopPlaceModal({
    isOpen,
    setIsOpen,
    tile,
}: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    tile: BoardTileDB
}) {
    return (
        <Modal open={isOpen} onDismiss={() => setIsOpen(false)} size="medium">
            <Heading2 as="h1">Rediger {tile.displayName ?? tile.name}</Heading2>
            <Button
                onClick={() => setIsOpen(false)}
                variant="primary"
                className="mt-4"
            >
                Lukk
            </Button>
        </Modal>
    )
}

export { EditStopPlaceModal }
