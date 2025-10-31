'use client'
import { useToast } from '@entur/alert'
import { Button } from '@entur/button'
import { OverflowMenuItem } from '@entur/menu'
import { BoardDB } from 'types/db-types/boards'
import { FolderId } from 'types/db-types/folders'
import { duplicateBoard } from './actions'

interface DuplicateBoardProps {
    board: BoardDB
    folderid?: FolderId
    type?: 'button' | 'menuitem'
}
function DuplicateBoard({
    board,
    folderid,
    type = 'button',
}: DuplicateBoardProps) {
    const { addToast } = useToast()

    async function onClick() {
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

    if (type === 'button') {
        return (
            <Button
                variant="secondary"
                aria-label="Dupliser tavle"
                onClick={onClick}
            >
                Dupliser tavle
            </Button>
        )
    } else {
        return (
            <OverflowMenuItem onClick={onClick}>
                Dupliser tavle
            </OverflowMenuItem>
        )
    }
}

export { DuplicateBoard }
