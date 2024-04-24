import { Heading1, Paragraph } from '@entur/typography'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { CreateOrganization } from './components/CreateOrganization'
import { OrganizationsTable } from './components/OrganizationsTable'
import { Metadata } from 'next'
import { verifySession } from '../utils/firebase'
import { getOrganizationsForUser } from '../actions'

export const metadata: Metadata = {
    title: 'Organisasjoner | Entur Tavla',
}

async function OrganizationsPage() {
    const session = cookies().get('session')
    const user = await verifySession(session?.value)

    if (!user) redirect('/#login')

    const organizations = await getOrganizationsForUser()

    return (
        <>
            <Heading1>Organisasjoner</Heading1>
            <div className="flex flex-col mx-auto md:flex-row justify-between mb-6 md:mb-0 md:gap-4">
                <Paragraph className=" w-full md:w-3/4">
                    Dette er en oversikt over hvilke organisasjoner du er en del
                    av. For hver organisasjon kan det settes innstillinger som
                    vil gjelde for alle tilhørende tavler. Det er også mulig å
                    administrere hvem som har tilgang til tavlene i
                    organisasjonen.
                </Paragraph>
                <CreateOrganization />
            </div>
            <OrganizationsTable
                organizations={organizations}
                userId={user.uid}
            />
        </>
    )
}

export default OrganizationsPage
