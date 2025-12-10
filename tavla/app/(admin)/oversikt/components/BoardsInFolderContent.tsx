'use client'

import { Label } from '@entur/typography'
import { BoardDB } from 'types/db-types/boards'
import { useSearchAndFilter } from '../hooks/useSearchAndFilter'
import { BoardTable } from './BoardTable'
import EmptyOverview from './EmptyOverview'
import { Search } from './Search'

interface BoardsInFolderContentProps {
    allBoards: BoardDB[]
}

export function BoardsInFolderContent({
    allBoards,
}: BoardsInFolderContentProps) {
    const { boards: filteredBoards } = useSearchAndFilter({
        allBoards,
        useAllBoardsForDefault: true,
    })

    return (
        <>
            <Search />
            <div className="mt-8 flex flex-col">
                <Label>Totalt antall tavler: {allBoards.length}</Label>
                {filteredBoards.length === 0 ? (
                    <EmptyOverview text="Ingen resultater funnet for ditt søk." />
                ) : (
                    <BoardTable boards={filteredBoards} />
                )}
            </div>
        </>
    )
}
