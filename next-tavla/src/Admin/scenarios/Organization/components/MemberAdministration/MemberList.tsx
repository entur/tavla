import { IconButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { TOrganizationID, TUser, TUserID } from 'types/settings'
import classes from './styles.module.css'
import { removeUserAction } from 'Admin/utils/formActions'
import { HiddenInput } from 'components/Form/HiddenInput'

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
        <div className="flexColumn g-1">
            {members.map((member) => (
                <div className={classes.memberListRow} key={member.uid}>
                    <div>{member.email}</div>
                    {member.uid !== currentUserId && (
                        <form action={removeUserAction}>
                            <HiddenInput id="userId" value={member.uid} />
                            <HiddenInput id="organizationId" value={oid} />
                            <IconButton type="submit" aria-label="Fjern bruker">
                                <DeleteIcon />
                            </IconButton>
                        </form>
                    )}
                </div>
            ))}
        </div>
    )
}

export { MemberList }
