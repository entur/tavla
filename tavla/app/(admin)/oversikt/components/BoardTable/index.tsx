'use client'
import { BoardIcon, FolderIcon } from '@entur/icons'
import {
    DataCell,
    HeaderCell,
    Table,
    TableBody,
    TableHead,
    TableRow,
    useSortableData,
} from '@entur/table'
import { TableActions } from 'app/(admin)/oversikt/components/Column/Actions'
import {
    DEFAULT_BOARD_NAME,
    DEFAULT_FOLDER_NAME,
} from 'app/(admin)/utils/constants'
import { formatTimestamp } from 'app/(admin)/utils/time'
import { Folder } from 'app/(admin)/utils/types'
import Link from 'next/link'
import { BoardDB } from 'types/db-types/boards'

type BoardTableProps = {
    folders?: Folder[]
    boards: BoardDB[]
}

type BaseTableItem = {
    id: string
    name: string
    link: string
    lastModified: string
}

type BoardTableItem = BaseTableItem & {
    type: 'board'
    board: BoardDB
}

type FolderTableItem = BaseTableItem & {
    type: 'folder'
    folder: Folder
}

export type TableItem = BoardTableItem | FolderTableItem

function BoardTable({ folders = [], boards }: BoardTableProps) {
    const foldersMapped: TableItem[] = folders.map((folder) => ({
        type: 'folder',
        id: folder.id,
        name: `${folder?.name ?? DEFAULT_FOLDER_NAME} (${folder.boardCount})`,
        link: `/mapper/${folder.id}`,
        lastModified: folder.lastUpdated
            ? formatTimestamp(folder.lastUpdated)
            : '-',
        folder: folder,
    }))

    const boardsMapped: TableItem[] = boards.map((board) => ({
        type: 'board',
        id: board.id,
        name: board.meta.title ?? DEFAULT_BOARD_NAME,
        link: `/tavler/${board.id}/rediger`,
        lastModified: board.meta.dateModified
            ? formatTimestamp(board.meta.dateModified)
            : '-',
        board: board,
    }))

    const tableItems: TableItem[] = foldersMapped.concat(boardsMapped)

    const { sortedData, getSortableHeaderProps, getSortableTableProps } =
        useSortableData(tableItems)

    const sortedFolders = sortedData?.filter((data) => data.type === 'folder')
    const sortedBoards = sortedData?.filter((data) => data.type === 'board')

    const sortedTableItems: TableItem[] = [...sortedFolders, ...sortedBoards]

    return (
        <Table {...getSortableTableProps()}>
            <TableHead>
                <TableRow className="bg-secondary">
                    <HeaderCell {...getSortableHeaderProps({ name: 'name' })}>
                        Navn
                    </HeaderCell>
                    <HeaderCell
                        {...getSortableHeaderProps({ name: 'lastModified' })}
                    >
                        Sist endret
                    </HeaderCell>
                    <HeaderCell>Handlinger</HeaderCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {sortedTableItems?.map((data: TableItem) => (
                    <TableRow
                        key={data.id}
                        className="odd:bg-primary even:bg-secondary"
                    >
                        <DataCell>
                            <Link
                                href={data.link}
                                className="flex flex-row items-center gap-2 hover:underline"
                            >
                                {data.type === 'folder' ? (
                                    <FolderIcon aria-label="Mappe-ikon" />
                                ) : (
                                    <BoardIcon aria-label="Tavle-ikon" />
                                )}
                                {data.name}
                            </Link>
                        </DataCell>
                        <DataCell>{data.lastModified}</DataCell>
                        <DataCell className="flex flex-row gap-1">
                            <TableActions data={data} />
                        </DataCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export { BoardTable }
