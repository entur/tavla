'use client'
import { useToast } from '@entur/alert'
import { Button } from '@entur/button'
import { BoardDB } from 'types/db-types/boards'
import { FolderDB } from 'types/db-types/folders'
import { duplicateBoard } from './actions'

function DuplicateBoard({
    board,
    folderid,
}: {
    board: BoardDB
    folderid?: FolderDB['id']
}) {
    const { addToast } = useToast()
    const handleSelect = async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...duplicationPayload } = board
        await duplicateBoard(
            {
                ...duplicationPayload,
                meta: {
                    ...duplicationPayload.meta,
                    title: duplicationPayload.meta.title + ' - duplikat',
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
