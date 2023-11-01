import { IconButton } from '@entur/button'
import { ExpandablePanel } from '@entur/expand'
import { DeleteIcon } from '@entur/icons'
import { TOrganizationID, TUser } from 'types/settings'

function MemberList({
    oid,
    members,
}: {
    oid: TOrganizationID
    members: TUser[]
}) {
    return (
        <ExpandablePanel title="Medlemmer">
            <div className="flexColumn g-1">
                {members.map((member) => (
                    <div className="flexRow justifyBetween" key={member.uid}>
                        <div>{member.email}</div>
                        <IconButton
                            aria-label="Fjern bruker"
                            onClick={() => {
                                fetch(
                                    `/api/organization/${oid}/members/${member.uid}`,
                                    {
                                        method: 'DELETE',
                                    },
                                )
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
