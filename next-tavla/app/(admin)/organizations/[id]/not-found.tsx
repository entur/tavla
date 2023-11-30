import { IllustratedNotFound } from 'Admin/components/IllustratedNotFound'

function NotFoundPage() {
    return (
        <IllustratedNotFound
            title="Fant ikke organisasjonen!"
            description="Organisasjonen du prøvde å finne eksisterer ikke, eller så har du ikke tilgang til den."
        />
    )
}

export default NotFoundPage
