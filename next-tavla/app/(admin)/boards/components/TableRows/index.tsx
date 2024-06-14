import { useSortBoardFunction } from '../../hooks/useSortBoardFunction'
import { Column } from '../Column'
import { Fragment } from 'react'
import { TBoard, TBoardWithOrganizaion } from 'types/settings'
import { uniq } from 'lodash'
import { TTag } from 'types/meta'
import { useSearchParam } from '../../hooks/useSearchParam'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { DEFAULT_BOARD_COLUMNS, TBoardsColumn } from 'app/(admin)/utils/types'

function TableRows({
    boardsWithOrg,
}: {
    boardsWithOrg: TBoardWithOrganizaion[]
}) {
    const search = useSearchParam('search') ?? ''
    const filter = useSearchParam('tags')?.split(',') ?? []
    const sortFunction = useSortBoardFunction()
    const searchFilter = new RegExp(
        search.replace(/[^a-z/Wæøå0-9- ]+/g, ''),
        'i',
    )

    const filterByTitle = (board: TBoard) =>
        searchFilter.test(board?.meta?.title ?? DEFAULT_BOARD_NAME)

    const filterByTags = (board: TBoard) =>
        filter.length === 0 ||
        filter.every((tag) => (board?.meta?.tags ?? []).includes(tag))

    return (
        <>
            {boardsWithOrg
                .filter((boardWithOrg: TBoardWithOrganizaion) =>
                    filterByTitle(boardWithOrg.board),
                )
                .filter((boardWithOrg: TBoardWithOrganizaion) =>
                    filterByTags(boardWithOrg.board),
                )
                .sort(sortFunction)
                .map((boardWithOrg: TBoardWithOrganizaion) => (
                    <TableRow
                        key={boardWithOrg.board.id}
                        boardWithOrg={boardWithOrg}
                        tags={uniq(
                            boardsWithOrg.flatMap(
                                (boardWithOrg) =>
                                    boardWithOrg.board?.meta?.tags ?? [],
                            ),
                        )}
                    />
                ))}
        </>
    )
}

function TableRow({
    boardWithOrg,
    tags,
}: {
    boardWithOrg: TBoardWithOrganizaion
    tags: TTag[]
}) {
    const columns = DEFAULT_BOARD_COLUMNS
    return (
        <Fragment key={boardWithOrg.board.id}>
            {columns.map((column: TBoardsColumn) => (
                <Column
                    key={column}
                    boardWithOrg={boardWithOrg}
                    column={column}
                    tags={tags}
                />
            ))}
        </Fragment>
    )
}

export { TableRows }
