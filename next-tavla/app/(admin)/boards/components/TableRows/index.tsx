import { useSortBoardFunction } from '../../hooks/useSortBoardFunction'
import { Column } from '../Column'
import { Fragment } from 'react'
import { TBoard, TBoardWithOrganizaion } from 'types/settings'
import { uniq } from 'lodash'
import { TTag } from 'types/meta'
import { useSearchParam } from '../../hooks/useSearchParam'
import {
    DEFAULT_BOARD_NAME,
    DEFAULT_ORGANIZATION_NAME,
} from 'app/(admin)/utils/constants'
import { DEFAULT_BOARD_COLUMNS, TBoardsColumn } from 'app/(admin)/utils/types'

function TableRows({
    boardsWithOrg,
}: {
    boardsWithOrg: TBoardWithOrganizaion[]
}) {
    const search = useSearchParam('search') ?? ''
    const filter = useSearchParam('tags')?.split(',') ?? []
    const sortFunction = useSortBoardFunction()
    const searchFilters = search
        .split(' ')
        .map((part) => new RegExp(part.replace(/[^a-z/Wæøå0-9- ]+/g, ''), 'i'))

    const filterByTitleAndOrgName = (boardWithOrg: TBoardWithOrganizaion) =>
        searchFilters
            .map(
                (filter) =>
                    filter.test(
                        boardWithOrg?.board.meta.title ?? DEFAULT_BOARD_NAME,
                    ) ||
                    filter.test(
                        boardWithOrg.organization?.name ??
                            DEFAULT_ORGANIZATION_NAME,
                    ),
            )
            .every((e) => e === true)

    const filterByTags = (board: TBoard) =>
        filter.length === 0 ||
        filter.every((tag) => (board?.meta?.tags ?? []).includes(tag))

    const boardWithOrg = boardsWithOrg
        .filter(filterByTitleAndOrgName)
        .filter((board) => filterByTags(board.board))
        .sort(sortFunction)
    return (
        <>
            {boardWithOrg.map((boardWithOrg: TBoardWithOrganizaion) => (
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
