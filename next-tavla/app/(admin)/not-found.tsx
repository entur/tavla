import { IllustratedNotFound } from 'Admin/components/IllustratedNotFound'

function NotFoundPage() {
    return (
        <IllustratedNotFound
            title="404 - fant ikke siden"
            description="Oooops! Denne siden finnes ikke. Dobbeltsjekk at nettadressen er riktig."
        />
    )
}

export default NotFoundPage
