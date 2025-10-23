'use client'
import { Label } from '@entur/typography'
import { Folder } from 'app/(admin)/utils/types'
import { TBoard } from 'types/settings'
import { useSearchAndFilter } from '../hooks/useSearchAndFilter'
import { BoardTable } from './BoardTable'
import EmptyOverview from './EmptyOverview'
import { Search } from './Search'

interface FoldersAndBoardsContentProps {
    folders: Folder[]
    privateBoards: TBoard[]
    allBoards: TBoard[]
}

export function FoldersAndBoardsContent({
    folders,
    privateBoards,
    allBoards,
}: FoldersAndBoardsContentProps) {
    const totalBoards =
        folders.reduce((sum, folder) => sum + (folder.boardCount ?? 0), 0) +
        privateBoards.length
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
                <Label>Totalt antall tavler: {totalBoards}</Label>
                <BoardTable folders={filteredFolders} boards={filteredBoards} />
            </div>
        </>
    )
}
