import { useSortBoardFunction } from '../../hooks/useSortBoardFunction'
import { TBoard } from 'types/settings'
import { uniq } from 'lodash'
import { useSearchParam } from '../../hooks/useSearchParam'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { DataCell, TableRow } from '@entur/table'
import { Name } from '../Column/Name'
import { Actions } from '../Column/Actions'
import { LastModified } from '../Column/LastModified'
import { Tags } from '../Column/Tags'
import { Organization } from '../Column/Organization'

function TableRows({ boards }: { boards: TBoard[] }) {
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
            {boards
                .filter((board: TBoard) => filterByTitle(board))
                .filter((board: TBoard) => filterByTags(board))
                .sort(sortFunction)
                .map((board: TBoard) => (
                    <TableRow key={board.id} className="h-14">
                        <DataCell>
                            <Name name={board.meta?.title} />
                        </DataCell>
                        <DataCell>
                            <Tags
                                board={board}
                                allTags={uniq(
                                    boards.flatMap(
                                        (board) => board?.meta?.tags ?? [],
                                    ),
                                )}
                            />
                        </DataCell>
                        <DataCell>
                            <LastModified
                                timestamp={board.meta?.dateModified}
                            />
                        </DataCell>
                        <DataCell>
                            <Organization organization="org navn" />
                        </DataCell>
                        <DataCell>
                            <Actions board={board} />
                        </DataCell>
                    </TableRow>
                ))}
        </>
    )
}

export { TableRows }
