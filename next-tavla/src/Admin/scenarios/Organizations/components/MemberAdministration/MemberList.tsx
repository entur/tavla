import { IconButton } from '@entur/button'
import { ExpandablePanel } from '@entur/expand'
import { DeleteIcon } from '@entur/icons'
import { fetchRemoveUserFromOrganization } from 'Admin/utils/fetch'
import { TOrganizationID, TUser } from 'types/settings'
import classes from './styles.module.css'

function MemberList({
    oid,
    members,
    removeMember,
}: {
    oid: TOrganizationID
    members: TUser[]
    removeMember: (uid: string) => void
}) {
    return (
        <ExpandablePanel title="Medlemmer" defaultOpen={members.length < 10}>
            <div className="flexColumn g-1">
                {members.map((member) => (
                    <div className={classes.memberListRow} key={member.uid}>
                        <div>{member.email}</div>
                        <IconButton
                            aria-label="Fjern bruker"
                            onClick={() => {
                                fetchRemoveUserFromOrganization(
                                    oid,
                                    member.uid ?? '',
                                ).then(() => removeMember(member.uid ?? ''))
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </div>
                ))}
            </div>
        </ExpandablePanel>
    )
}

export { MemberList }
