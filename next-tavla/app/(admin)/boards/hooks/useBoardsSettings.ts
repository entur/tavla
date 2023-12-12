import {
    BoardsColumns,
    DEFAULT_BOARD_COLUMNS,
    TBoardsColumn,
    TSort,
} from 'Admin/types/boards'
import { useSearchParams } from 'next/navigation'
import { TTag } from 'types/meta'

export function useBoardsSettings() {
    const searchParams = useSearchParams()
    const params = new URLSearchParams(searchParams ?? undefined)

    const search = params.get('search') || ''

    const filterTags = params.get('filter')?.split(',') ?? ([] as TTag[])

    const sortParams = params.get('sort')?.split(':')
    const sort = {
        column: sortParams?.[0] as TBoardsColumn,
        type: sortParams?.[1] as TSort,
    }

    const columnParams = params
        .get('columns')
        ?.split(',')
        .filter((column) =>
            Object.keys(BoardsColumns).includes(column),
        ) as TBoardsColumn[]
    const columns =
        columnParams?.length > 0 ? columnParams : DEFAULT_BOARD_COLUMNS

    return { search, filterTags, sort, columns }
}
