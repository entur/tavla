'use client'
import { TableHeader } from 'app/(admin)/boards/components/TableHeader'
import {
    BoardsInFoldersColumns,
    DEFAULT_BOARD_IN_FOLDER_COLUMNS,
} from 'app/(admin)/utils/types'

import { TBoard } from 'types/settings'
import { FolderBoardTableRows } from '../FolderBoardTableRows'
import { PrimaryButton } from '@entur/button'
import { AddIcon } from '@entur/icons'
import { CreateBoard } from 'app/(admin)/components/CreateBoard'
import { IllustratedInfo } from 'app/(admin)/components/IllustratedInfo'
import { isEmpty } from 'lodash'
import Link from 'next/link'

function FolderBoardTable({ boardsInFolder }: { boardsInFolder: TBoard[] }) {
    if (isEmpty(boardsInFolder))
        return (
            <IllustratedInfo
                title="Her var det tomt!"
                description="Du har ikke laget noen tavler i denne mappen ennå."
            >
                <PrimaryButton as={Link} href="?board">
                    Opprett tavle <AddIcon /> <CreateBoard />
                </PrimaryButton>
            </IllustratedInfo>
        )
    return (
        <div
            className="grid items-center overflow-x-auto"
            style={{
                gridTemplateColumns: `repeat(${Object.keys(BoardsInFoldersColumns).length},auto)`,
            }}
        >
            <TableHeader columns={DEFAULT_BOARD_IN_FOLDER_COLUMNS} />
            <FolderBoardTableRows boards={boardsInFolder} />
        </div>
    )
}

export { FolderBoardTable }
