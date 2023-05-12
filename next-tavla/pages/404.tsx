import { Header } from 'scenarios/Header'

function NotFoundPage() {
    return (
        <div className="root">
            <Header />
            <p className="pl-2">Tavlen kunne ikke hentes!</p>
        </div>
    )
}

export default NotFoundPage
