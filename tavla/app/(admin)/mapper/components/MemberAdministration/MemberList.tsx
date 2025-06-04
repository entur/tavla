import { TOrganizationID, TUser, TUserID } from 'types/settings'
import { RemoveUserButton } from './RemoveUserButton'

function MemberList({
    members,
    uid: currentUserId,
    oid,
}: {
    members: TUser[]
    uid: TUserID
    oid?: TOrganizationID
}) {
    return (
        <div className="overflow-x-auto">
            <div className="grid items-center grid-cols-2 sm:grid-cols-3 font-medium bg-grey70">
                <p className="flex p-2 pr-0.5 sm:col-span-2">Medlemmer</p>
                <p className="flex p-2 pr-0.5">Handlinger</p>
            </div>

            {members.map((member, index) => (
                <div
                    className={`grid items-center grid-cols-2 sm:grid-cols-3 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-grey80'
                    }`}
                    key={member.uid}
                >
                    <p className="flex p-2 pr-0.5 sm:col-span-2">
                        {member.email}
                    </p>
                    <div
                        className={`flex p-2 pr-0.5 ${member.uid !== currentUserId ? 'py-2' : 'h-12'}`}
                    >
                        {member.uid !== currentUserId && (
                            <RemoveUserButton user={member} oid={oid} />
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export { MemberList }
