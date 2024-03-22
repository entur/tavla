import { Heading1, Paragraph } from '@entur/typography'
import classes from '../admin.module.css'
import { getOrganizationsWithUser, verifySession } from 'Admin/utils/firebase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { CreateOrganization } from './components/CreateOrganization'
import { OrganizationsTable } from './components/OrganizationsTable'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Organisasjoner | Entur Tavla',
}

async function OrganizationsPage() {
    const session = cookies().get('session')
    const user = await verifySession(session?.value)

    if (!user) redirect('/#login')

    const organizations = await getOrganizationsWithUser(user.uid)

    return (
        <div className={classes.root}>
            <main className="mt-4">
                <Heading1>Organisasjoner</Heading1>
                <div className="flexRow justifyBetween">
                    <Paragraph className="w-75">
                        Dette er en oversikt over hvilke organisasjoner du er en
                        del av. Her kan du også klikke deg inn på organisasjoner
                        og sette innstillinger for tavler som er lagt til i en
                        organisasjon. Du kan også administrere hvem som har
                        tilgang til tavlene i organisasjonen.
                    </Paragraph>
                    <CreateOrganization />
                </div>
                <OrganizationsTable
                    organizations={organizations}
                    userId={user.uid}
                />
            </main>
        </div>
    )
}

export default OrganizationsPage
