import { Heading2 } from '@entur/typography'
import { MemberList } from './MemberList'
import { TOrganizationID, TUser } from 'types/settings'
import { useEffect, useState } from 'react'

function MemberAdministration({ oid }: { oid: TOrganizationID }) {
    const [members, setMembers] = useState<TUser[]>([])

    useEffect(() => {
        async function fetchMembers() {
            const response = await fetch(`/api/organization/${oid}/members`)
            const { members } = await response.json()
            setMembers(members)
        }

        fetchMembers()
    }, [oid])

    return (
        <div>
            <Heading2>Administrer medlemmer</Heading2>
            <MemberList members={members} oid={oid} />
        </div>
    )
}

export { MemberAdministration }
