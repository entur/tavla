import { NotFound } from 'Admin/components/NotFound'

function AdminNotFoundPage() {
    return (
        <NotFound
            title="404 - fant ikke siden"
            description="Oooops! Denne siden finnes ikke. Skulle du kanskje et annet sted?"
        />
    )
}

export default AdminNotFoundPage
