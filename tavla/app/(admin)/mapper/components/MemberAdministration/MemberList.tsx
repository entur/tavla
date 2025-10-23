import {
    DataCell,
    HeaderCell,
    Table,
    TableBody,
    TableHead,
    TableRow,
} from '@entur/table'
import { AuthenticatedUser } from 'app/(admin)/mapper/[id]/page'
import { FolderIdDB } from 'types/db-types/folders'
import { UserIdDB } from 'types/db-types/users'
import { RemoveUserButton } from './RemoveUserButton'

function MemberList({
    members,
    uid: currentUserId,
    folderid,
}: {
    members: AuthenticatedUser[]
    uid: UserIdDB
    folderid?: FolderIdDB
}) {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <HeaderCell>Medlemmer</HeaderCell>
                    <HeaderCell>Handlinger</HeaderCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {members.map((member) => (
                    <TableRow key={member.uid}>
                        <DataCell>{member.email}</DataCell>
                        <DataCell>
                            {member.uid !== currentUserId && (
                                <RemoveUserButton
                                    user={member}
                                    folderid={folderid}
                                />
                            )}
                        </DataCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export { MemberList }
