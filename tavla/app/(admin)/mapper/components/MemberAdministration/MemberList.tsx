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
        <div className="w-full">
            <div className="grid items-center grid-cols-3">
                <p className="flex items-center gap-1 bg-grey70 pl-2 h-10 font-medium col-span-2">
                    Medlemmer
                </p>
                <p className="flex items-center gap-1 bg-grey70 pl-2 h-10 font-medium">
                    Handlinger
                </p>
            </div>

            <div className="grid items-center grid-cols-3 [&>*:nth-child(4n+3)]:bg-grey80 [&>*:nth-child(4n+4)]:bg-grey80">
                {members.map((member) => (
                    <>
                        <p
                            className="flex items-center pl-2 h-16 col-span-2"
                            key={'email' + member.uid}
                        >
                            {member.email}
                        </p>
                        <div
                            className="flex items-center justify-center h-16"
                            key={member.uid}
                        >
                            {member.uid !== currentUserId && (
                                <RemoveUserButton user={member} oid={oid} />
                            )}
                        </div>
                    </>
                ))}
            </div>
        </div>
    )
}

export { MemberList }
