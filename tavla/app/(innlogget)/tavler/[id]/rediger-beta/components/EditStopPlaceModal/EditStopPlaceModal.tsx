'use client'
import { Button } from '@entur/button'
import { Modal } from '@entur/modal'
import { Heading2 } from '@entur/typography'
import { SetStopPlaceName } from 'app/_components/TileCard/components/SetStopPlaceName'
import { useActionState } from 'node_modules/@types/react'
import type { BoardTileDB } from 'src/types/db-types/boards'

function EditStopPlaceModal({
    isOpen,
    setIsOpen,
    boardId,
    tile,
}: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    boardId: string
    tile: BoardTileDB
}) {
    async function handleSave(
        _prevState: StopPlaceModalState,
        payload: { element: 'clock' | 'logo'; value: ElementsValue },
    ) {
        const result = await saveElements(bid, payload.value)

        if (result?.status === 'success') {
            capture('board_settings_changed', {
                location: 'edit_board_page',
                setting: 'element_select',
                value: payload.element,
            })
        }
        return result
    }

    const [state, action] = useActionState(handleSave)

    return (
        <Modal open={isOpen} onDismiss={() => setIsOpen(false)} size="medium">
            <Heading2 as="h1">Rediger {tile.displayName ?? tile.name}</Heading2>

            <SetStopPlaceName></SetStopPlaceName>

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
