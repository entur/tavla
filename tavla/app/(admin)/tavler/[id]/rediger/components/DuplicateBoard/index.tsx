'use client'
import { useToast } from '@entur/alert'
import { Button } from '@entur/button'
import { OverflowMenuItem } from '@entur/menu'
import { BoardDB } from 'types/db-types/boards'
import { FolderDB } from 'types/db-types/folders'
import { duplicateBoard } from './actions'

interface DuplicateBoardProps {
    board: BoardDB
    folderid?: FolderDB['id']
    type?: 'button' | 'menuitem'
}
function DuplicateBoard({
    board,
    folderid,
    type = 'button',
}: DuplicateBoardProps) {
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

    if (type === 'button') {
        return (
            <Button
                variant="secondary"
                aria-label="Dupliser tavle"
                onClick={handleSelect}
            >
                Dupliser tavle
            </Button>
        )
    } else {
        return (
            <OverflowMenuItem onClick={handleSelect}>
                Dupliser tavle
            </OverflowMenuItem>
        )
    }
}

export { DuplicateBoard }
