import { NotFound } from 'Admin/components/NotFound'

function OrganizationNotFoundPage() {
    return (
        <NotFound
            title="Fant ikke organisasjonen!"
            description="Organisasjonen du prøvde å finne eksisterer ikke, eller så har du ikke tilgang til den."
        />
    )
}

export default OrganizationNotFoundPage
