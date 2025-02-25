import { Heading1, Paragraph } from '@entur/typography'
import { redirect } from 'next/navigation'
import { CreateOrganization } from './components/CreateOrganization'
import { Metadata } from 'next'
import { getOrganizationsForUser } from '../actions'
import { Organizations } from './components/Organizations'
import { getUserFromSessionCookie } from '../utils/server'

export const metadata: Metadata = {
    title: 'Mapper | Entur Tavla',
}

async function OrganizationsPage() {
    const user = await getUserFromSessionCookie()

    if (!user || !user.uid) redirect('/')

    const organizations = await getOrganizationsForUser()

    return (
        <div className="container pb-20 md:pb-40">
            <Heading1>Mapper</Heading1>
            <div className="flex flex-col mx-auto md:flex-row justify-between mb-6 md:mb-0 md:gap-4">
                <Paragraph className=" w-full md:w-3/4">
                    Dette er en oversikt over hvilke mapper du har tilgang til.
                    For hver mappe kan det settes innstillinger som vil gjelde
                    for alle tilhørende tavler. Det er også mulig å administrere
                    hvem som har tilgang til tavlene i mappen.
                </Paragraph>
                <CreateOrganization />
            </div>
            <Organizations organizations={organizations} userId={user.uid} />
        </div>
    )
}

export default OrganizationsPage
