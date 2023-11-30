import { Heading1, Heading2, Paragraph } from '@entur/typography'
import { CreateOrganization } from './components/CreateOrganization'
import { TOrganization, TUserID } from 'types/settings'
import { OrganizationsTable } from './components/OrganizationsTable'
import { ToastProvider } from 'Admin/components/ToastProvider'

function Organizations(props: {
    organizations: TOrganization[]
    userId: TUserID
}) {
    return (
        <div>
            <div className="mt-4">
                <Heading1>Organisasjoner</Heading1>
                <Heading2 className="mb-2 text-rem-3">
                    Oversikt over organisasjoner
                </Heading2>
                <div className="flexRow justifyBetween">
                    <Paragraph className="w-75">
                        Dette er en oversikt over hvilke organisasjoner du er en
                        del av. Her kan du også klikke deg inn på organisasjoner
                        og sette innstillinger for tavler som er lagt til i en
                        organisasjon. Du kan også administrere hvem som har
                        tilgang til tavlene i organisasjonen.
                    </Paragraph>
                    <ToastProvider>
                        <CreateOrganization />
                    </ToastProvider>
                </div>
                <OrganizationsTable {...props} />
            </div>
        </div>
    )
}
export { Organizations }
