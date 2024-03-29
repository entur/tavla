import { TOrganizationID, TUser, TUserID } from 'types/settings'
import classes from './styles.module.css'
import { RemoveUserButton } from './RemoveUserButton'

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
                <div>E-post</div>
                <div>Valg</div>
            </div>

            {members.map((member) => (
                <div className={classes.memberListRow} key={member.uid}>
                    <div>{member.email}</div>
                    {member.uid !== currentUserId && (
                        <RemoveUserButton user={member} oid={oid} />
                    )}
                </div>
            ))}
        </div>
    )
}

export { MemberList }
