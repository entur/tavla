'use client'
import { useToast } from '@entur/alert'
import { Button } from '@entur/button'
import { BoardDB } from 'types/db-types/boards'
import { FolderIdDB } from 'types/db-types/folders'
import { duplicateBoard } from './actions'

function DuplicateBoard({
    board,
    folderid,
}: {
    board: BoardDB
    folderid?: FolderIdDB
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
            folderid,
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
