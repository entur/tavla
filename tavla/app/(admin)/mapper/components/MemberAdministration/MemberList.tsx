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
        <div>
            <div className="grid items-center overflow-x-auto grid-cols-3">
                <p className="flex items-center gap-1 bg-grey70 pl-2 h-10 font-medium py-0 px-0.5 col-span-2">
                    Medlemmer
                </p>
                <p className="flex items-center gap-1 bg-grey70 pl-2 h-10 font-medium py-0 px-0.5">
                    Handlinger
                </p>
            </div>

            <div className="grid items-center overflow-x-auto grid-cols-3">
                {members.map((member, index) => (
                    <div
                        className={`flex items-stretch col-span-3 ${
                            index % 2 === 0 ? 'bg-white' : 'bg-grey80'
                        }`}
                        key={member.uid}
                    >
                        <p
                            className="flex items-center pl-2 py-2 col-span-2"
                            style={{ flex: 2 }}
                        >
                            {member.email}
                        </p>
                        <div
                            className="flex items-center pl-2 p-4"
                            style={{ flex: 1 }}
                        >
                            {member.uid !== currentUserId && (
                                <RemoveUserButton user={member} oid={oid} />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export { MemberList }
