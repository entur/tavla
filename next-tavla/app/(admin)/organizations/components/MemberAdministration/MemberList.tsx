import { TOrganizationID, TUser, TUserID } from 'types/settings'
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
        <div className="flex flex-col gap-1 mt-6">
            <div className="flex flex-row justify-between border-b-primary border-b-2 font-semibold pb-2">
                <p>E-post</p>
                <p>Handlinger</p>
            </div>

            {members.map((member) => (
                <div
                    className="flex flex-row justify-between items-center py-2 border-b-2 border-b-secondary"
                    key={member.uid}
                >
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
