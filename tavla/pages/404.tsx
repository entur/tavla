import { Header } from 'components/Header'

function NotFoundPage() {
    return (
        <div className="root">
            <div className="rootContainer">
                <Header />
                <p className="pl-8">Tavlen kunne ikke hentes!</p>
            </div>
        </div>
    )
}

export default NotFoundPage
