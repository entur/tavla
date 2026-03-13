'use client'
import { SearchIcon } from '@entur/icons'
import { Label } from '@entur/typography'
import { Folder } from 'app/(admin)/utils/types'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { BoardDB } from 'src/types/db-types/boards'
import { useSearchAndFilter } from '../hooks/useSearchAndFilter'
import EmptyOverview from './EmptyOverview'

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
    const [search, setSearch] = useState('')

    const { folders: filteredFolders, boards: filteredBoards } =
        useSearchAndFilter(search, folders, privateBoards, allBoards)

    if (elementsListCount === 0) {
        return (
            <EmptyOverview text="Her var det tomt gitt! Start med å opprette en mappe eller en tavle" />
        )
    }

    return (
        <>
            <ClientOnlyTextField
                label="Søk på navn på tavle eller mappe"
                prepend={<SearchIcon aria-hidden="true" />}
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value)
                }}
                id="search"
                clearable
                onClear={() => {
                    setSearch('')
                }}
            />
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
