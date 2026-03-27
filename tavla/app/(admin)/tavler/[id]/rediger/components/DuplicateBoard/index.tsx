'use client'
import { useToast } from '@entur/alert'
import { Button } from '@entur/button'
import { OverflowMenuItem } from '@entur/menu'
import type { BoardDB } from 'src/types/db-types/boards'
import type { FolderDB } from 'src/types/db-types/folders'
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
        const { id: _id, ...duplicationPayload } = board
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
