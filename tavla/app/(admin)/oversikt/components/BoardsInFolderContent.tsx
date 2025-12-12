'use client'

import { BoardDB } from 'types/db-types/boards'
import { useSortBoardFunction } from '../hooks/useSortBoardFunction'
import { BoardTable } from './BoardTable'
import EmptyOverview from './EmptyOverview'

interface BoardsInFolderContentProps {
    allBoards: BoardDB[]
}

export function BoardsInFolderContent({
    allBoards,
}: BoardsInFolderContentProps) {
    const sortBoardFunction = useSortBoardFunction()

    const sortedBoards = [...allBoards].sort(sortBoardFunction)

    return (
        <>
            {sortedBoards.length === 0 ? (
                <EmptyOverview text="Ingen resultater funnet for ditt søk." />
            ) : (
                <BoardTable boards={sortedBoards} />
            )}
        </>
    )
}
