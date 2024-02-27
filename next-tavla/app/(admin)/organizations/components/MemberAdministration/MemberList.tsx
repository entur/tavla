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
        <div className="flexColumn g-1 mt-3">
            <div className={classes.tableHeader}>
                {MEMBER_TABLE_COLUMNS.map((column) => (
                    <div key={column}>{MemberTableColumn[column]}</div>
                ))}
            </div>

            {members.map((member) => (
                <div className={classes.memberListRow} key={member.uid}>
                    <div>{member.email} </div>
                    {member.uid !== currentUserId && (
                        <RemoveUserButton user={member} oid={oid} />
                    )}
                </div>
            ))}
        </div>
    )
}

export { MemberList }
