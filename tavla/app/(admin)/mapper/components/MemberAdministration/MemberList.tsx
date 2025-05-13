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

            <div className="grid items-center overflow-x-auto grid-cols-3 [&>*:nth-child(4n+3)]:bg-grey80 [&>*:nth-child(4n+4)]:bg-grey80">
                {members.map((member) => (
                    <>
                        <p
                            className="content-center pl-2 h-16 py-2 col-span-2"
                            key={'email' + member.uid}
                        >
                            {member.email}
                        </p>
                        <div
                            className="content-center pl-2 h-16"
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
