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
            <div className="grid grid-cols-3 items-center overflow-x-auto">
                <p className="col-span-2 flex h-10 items-center gap-1 bg-grey70 px-0.5 py-0 pl-2 font-medium">
                    Medlemmer
                </p>
                <p className="flex h-10 items-center gap-1 bg-grey70 px-0.5 py-0 pl-2 font-medium">
                    Handlinger
                </p>
            </div>

            <div className="grid grid-cols-3 items-center overflow-x-auto [&>*:nth-child(4n+3)]:bg-grey80 [&>*:nth-child(4n+4)]:bg-grey80">
                {members.map((member) => (
                    <>
                        <p
                            className="col-span-2 h-16 content-center py-2 pl-2"
                            key={'email' + member.uid}
                        >
                            {member.email}
                        </p>
                        <div
                            className="h-16 content-center pl-2"
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
