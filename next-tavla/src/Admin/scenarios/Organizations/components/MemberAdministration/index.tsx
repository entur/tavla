import { Heading2, LeadParagraph } from '@entur/typography'
import { MemberList } from './MemberList'
import { TOrganizationID, TUser, TUserID } from 'types/settings'
import { useEffect, useState } from 'react'
import { InviteUser } from './InviteUser'

function MemberAdministration({ oid }: { oid: TOrganizationID }) {
    const [members, setMembers] = useState<TUser[]>([])

    useEffect(() => {
        async function fetchMembers() {
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
        <div className="flexColumn">
            <Heading2>Administrer medlemmer</Heading2>
            <LeadParagraph>
                Her kan du administrere medlemmer av organisasjonen. Du kan se
                hvem som er medlem, legge til medlemmer og fjerne medlemmer.
            </LeadParagraph>
            <MemberList
                members={members}
                oid={oid}
                removeMember={removeMember}
            />
            <InviteUser oid={oid} addMember={addMember} />
        </div>
    )
}

export { MemberAdministration }
