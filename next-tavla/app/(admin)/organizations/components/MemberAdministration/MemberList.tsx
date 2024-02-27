import { TOrganizationID, TUser, TUserID } from 'types/settings'
import classes from './styles.module.css'
import { RemoveUserButton } from './RemoveUserButton'
import {
    MEMBER_TABLE_COLUMNS,
    MemberTableColumn,
} from 'Admin/types/organizations'

function MemberList({
    members,
    uid: currentUserId,
    oid,
}: {
    members: TUser[]
    uid?: TUserID
    oid?: TOrganizationID
}) {
    return (
        <table className="flexColumn g-1 mt-3">
            <thead>
                <tr className={classes.tableHeader}>
                    {MEMBER_TABLE_COLUMNS.map((column) => (
                        <th key={column}>{MemberTableColumn[column]}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {members.map((member) => (
                    <tr className={classes.memberListRow} key={member.uid}>
                        <td>{member.email}</td>
                        {member.uid !== currentUserId && (
                            <td>
                                <RemoveUserButton user={member} oid={oid} />
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export { MemberList }
