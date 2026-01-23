'use client'
import { Label } from '@entur/typography'
import { Folder } from 'app/(admin)/utils/types'
import dynamic from 'next/dynamic'
import { BoardDB } from 'src/types/db-types/boards'
import { useSearchAndFilter } from '../hooks/useSearchAndFilter'
import EmptyOverview from './EmptyOverview'
import { Search } from './Search'

const BoardTable = dynamic(
    () => import('./BoardTable').then((mod) => ({ default: mod.BoardTable })),
    { ssr: false },
)

interface FoldersAndBoardsContentProps {
    folders: Folder[]
    privateBoards: BoardDB[]
    allBoards: BoardDB[]
}

export function FoldersAndBoardsContent({
    folders,
    privateBoards,
    allBoards,
}: FoldersAndBoardsContentProps) {
    const elementsListCount = privateBoards.length + folders.length

    const { folders: filteredFolders, boards: filteredBoards } =
        useSearchAndFilter({
            folders,
            privateBoards,
            allBoards,
        })

    if (elementsListCount === 0) {
        return (
            <EmptyOverview text="Her var det tomt gitt! Start med å opprette en mappe eller en tavle" />
        )
    }

    return (
        <>
            <Search />
            <div className="mt-8 flex flex-col">
                <Label>Totalt antall tavler: {allBoards.length}</Label>
                {filteredFolders.length === 0 && filteredBoards.length === 0 ? (
                    <EmptyOverview text="Ingen resultater funnet for ditt søk." />
                ) : (
                    <BoardTable
                        folders={filteredFolders}
                        boards={filteredBoards}
                    />
                )}
            </div>
        </>
    )
}
