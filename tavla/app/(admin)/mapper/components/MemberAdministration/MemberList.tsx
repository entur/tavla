import { TFolderID, TUser, TUserID } from 'types/settings'
import { RemoveUserButton } from './RemoveUserButton'
import {
    DataCell,
    HeaderCell,
    Table,
    TableBody,
    TableHead,
    TableRow,
} from '@entur/table'

function MemberList({
    members,
    uid: currentUserId,
    oid,
}: {
    members: TUser[]
    uid: TUserID
    oid?: TFolderID
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
                                <RemoveUserButton user={member} oid={oid} />
                            )}
                        </DataCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export { MemberList }
