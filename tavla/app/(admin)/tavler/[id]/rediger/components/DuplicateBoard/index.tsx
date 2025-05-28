'use client'
import { useToast } from '@entur/alert'
import { Button } from '@entur/button'
import { TBoard, TOrganizationID } from 'types/settings'
import { duplicateBoard } from './actions'

function DuplicateBoard({
    board,
    oid,
}: {
    board: TBoard
    oid?: TOrganizationID
}) {
    const { addToast } = useToast()
    const handleSelect = async () => {
        delete board.id
        await duplicateBoard(
            {
                ...board,
                meta: {
                    ...board.meta,
                    title: board.meta.title + ' - duplikat',
                },
            },
            oid,
        )
        addToast('Tavle duplisert!')
    }
    return (
        <Button
            variant="secondary"
            aria-label="Dupliser tavle"
            onClick={handleSelect}
        >
            Dupliser tavle
        </Button>
    )
}

export { DuplicateBoard }
