import { TBoard, TBoardWithOrganization } from 'types/settings'
import { uniq } from 'lodash'
import { useSearchParam } from '../../hooks/useSearchParam'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { DataCell, TableBody, TableRow } from '@entur/table'
import { Name } from '../Column/Name'
import { Actions } from '../Column/Actions'
import { LastModified } from '../Column/LastModified'
import { Tags } from '../Column/Tags'
import { Organization } from '../Column/Organization'

function TableRows({
    boardsWithOrgs,
}: {
    boardsWithOrgs: TBoardWithOrganization[]
}) {
    const search = useSearchParam('search') ?? ''
    const filter = useSearchParam('tags')?.split(',') ?? []

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
        <TableBody className="[&>*:nth-child(even)]:bg-secondary">
            {boardsWithOrgs
                .filter((boardWithOrg: TBoardWithOrganization) =>
                    filterByTitle(boardWithOrg.board),
                )
                .filter((boardWithOrg: TBoardWithOrganization) =>
                    filterByTags(boardWithOrg.board),
                )
                .map((boardWithOrg: TBoardWithOrganization) => (
                    <TableRow key={boardWithOrg.board.id} className="h-14">
                        <DataCell>
                            <Name board={boardWithOrg.board} />
                        </DataCell>
                        <DataCell>
                            <Tags
                                board={boardWithOrg.board}
                                allTags={uniq(
                                    boardsWithOrgs.flatMap(
                                        (boardWithOrg) =>
                                            boardWithOrg.board?.meta?.tags ??
                                            [],
                                    ),
                                )}
                            />
                        </DataCell>
                        <DataCell>
                            <LastModified
                                timestamp={
                                    boardWithOrg.board.meta?.dateModified
                                }
                            />
                        </DataCell>
                        <DataCell>
                            <Organization
                                organization={boardWithOrg.organization}
                            />
                        </DataCell>
                        <DataCell>
                            <Actions board={boardWithOrg.board} />
                        </DataCell>
                    </TableRow>
                ))}
        </TableBody>
    )
}

export { TableRows }
