import { useSortBoardFunction } from '../../hooks/useSortBoardFunction'
import { Column } from '../Column'
import { Fragment } from 'react'
import { TBoardWithOrganizaion } from 'types/settings'
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

    const boardWithOrg = boardsWithOrg
        .filter(filterByTitleAndOrgName)
        .sort(sortFunction)
    return (
        <>
            {boardWithOrg.map((boardWithOrg: TBoardWithOrganizaion) => (
                <TableRow
                    key={boardWithOrg.board.id}
                    boardWithOrg={boardWithOrg}
                />
            ))}
        </>
    )
}

function TableRow({ boardWithOrg }: { boardWithOrg: TBoardWithOrganizaion }) {
    const columns = DEFAULT_BOARD_COLUMNS
    return (
        <Fragment key={boardWithOrg.board.id}>
            {columns.map((column: TBoardsColumn) => (
                <Column
                    key={column}
                    boardWithOrg={boardWithOrg}
                    column={column}
                />
            ))}
        </Fragment>
    )
}

export { TableRows }
