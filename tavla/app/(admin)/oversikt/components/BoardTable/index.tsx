'use client'
import { BoardIcon, FolderIcon, ValidationInfoFilledIcon } from '@entur/icons'
import {
    DataCell,
    HeaderCell,
    Table,
    TableBody,
    TableHead,
    TableRow,
    useSortableData,
} from '@entur/table'
import { Tooltip } from '@entur/tooltip'
import { TableActions } from 'app/(admin)/oversikt/components/Column/Actions'
import {
    DEFAULT_BOARD_NAME,
    DEFAULT_FOLDER_NAME,
} from 'app/(admin)/utils/constants'
import { formatTimestamp, lastActiveToStatus } from 'app/(admin)/utils/time'
import { Folder } from 'app/(admin)/utils/types'
import Link from 'next/link'
import { BoardDB } from 'src/types/db-types/boards'

type BoardTableProps = {
    folders?: Folder[]
    boards: BoardDB[]
}

type BaseTableItem = {
    id: string
    name: string
    link: string
    lastModified?: number
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
        lastModified: folder.lastUpdated,
        folder: folder,
    }))

    const boardsMapped: TableItem[] = boards.map((board) => ({
        type: 'board',
        id: board.id,
        name: board.meta.title ?? DEFAULT_BOARD_NAME,
        link: `/tavler/${board.id}/rediger`,
        lastModified: board.meta.dateModified,
        lastActiveTimestamp: board.meta.lastActiveTimestamp,
        board: board,
    }))

    const tableItems: TableItem[] = foldersMapped.concat(boardsMapped)

    const { sortedData, getSortableHeaderProps, getSortableTableProps } =
        useSortableData(tableItems)

    const sortedFolders = sortedData?.filter((data) => data.type === 'folder')
    const sortedBoards = sortedData?.filter((data) => data.type === 'board')

    const sortedTableItems: TableItem[] = [...sortedFolders, ...sortedBoards]

    return (
        <div className="overflow-x-auto">
            <Table {...getSortableTableProps()}>
                <TableHead>
                    <TableRow className="bg-secondary">
                        <HeaderCell
                            {...getSortableHeaderProps({ name: 'name' })}
                        >
                            Navn
                        </HeaderCell>
                        <HeaderCell
                            className="flex items-center"
                            aria-describedby="last-active-description"
                            {...getSortableHeaderProps({
                                name: 'lastActiveTimestamp',
                            })}
                        >
                            <span
                                id="last-active-description"
                                className="sr-only"
                            >
                                Viser når tavlen sist var i bruk. Dette gjelder
                                kun aktivitet etter 15. januar 2026.
                            </span>
                            Sist aktiv
                            <Tooltip
                                content="Viser når tavlen sist var i bruk. Dette gjelder kun aktivitet etter 15. januar 2026."
                                placement="top"
                            >
                                <ValidationInfoFilledIcon
                                    className="ml-1"
                                    style={{ cursor: 'help' }}
                                />
                            </Tooltip>
                        </HeaderCell>
                        <HeaderCell
                            className="text-nowrap"
                            {...getSortableHeaderProps({
                                name: 'lastModified',
                            })}
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
                            <DataCell>
                                {lastActiveToStatus(
                                    data.type === 'board'
                                        ? data.board.meta.lastActiveTimestamp
                                        : undefined,
                                )}
                            </DataCell>
                            <DataCell>
                                {data?.lastModified
                                    ? formatTimestamp(data.lastModified)
                                    : '-'}
                            </DataCell>
                            <DataCell className="flex flex-row gap-1">
                                <TableActions data={data} />
                            </DataCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export { BoardTable }
