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
            <div className="flex flex-row justify-between border-b-[var(--table-header-border-color)] border-b-2 font-semibold text-[var(--primary-text-color)] pb-2">
                <div>E-post</div>
                <div>Handlinger</div>
            </div>

            {members.map((member) => (
                <div
                    className="flex flex-row justify-between items-center py-2 border-b-2 border-b-[var(--table-border-color)]"
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
