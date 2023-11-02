import { Heading2, LeadParagraph } from '@entur/typography'
import { MemberList } from './MemberList'
import { TOrganizationID, TUser, TUserID } from 'types/settings'
import { useEffect, useState } from 'react'
import { InviteUser } from './InviteUser'

function MemberAdministration({ oid }: { oid: TOrganizationID }) {
    const [members, setMembers] = useState<TUser[]>([])

    useEffect(() => {
        const fetchMembers = async () => {
            const response = await fetch(`/api/organization/${oid}/members`)
            const { members } = await response.json()
            setMembers(members)
        }

        fetchMembers()
    }, [oid, members.length])

    const addMember = (member: TUser) => {
        setMembers([...members, member])
    }

    const removeMember = (uid: TUserID) => {
        setMembers(members.filter((member) => member.uid !== uid))
    }

    return (
        <div className="flexColumn g-4">
            <div>
                <Heading2>Administrer medlemmer</Heading2>
                <LeadParagraph>
                    Her kan du administrere medlemmer av organisasjonen. Du kan
                    se hvem som er medlem, legge til medlemmer og fjerne
                    medlemmer.
                </LeadParagraph>
            </div>
            <InviteUser oid={oid} addMember={addMember} />
            <MemberList
                members={members}
                removeMember={removeMember}
                oid={oid}
            />
        </div>
    )
}

export { MemberAdministration }
