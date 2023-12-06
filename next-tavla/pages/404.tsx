import { Header } from 'components/Header'
import TavlaHead from 'components/TavlaHead'
import classes from 'styles/pages/board.module.css'

function NotFoundPage() {
    return (
        <div className={classes.root}>
            <TavlaHead
                title="404 - fant ikke siden"
                description="Siden du prøvde å nå finnes ikke."
            />
            <div className={classes.rootContainer}>
                <Header />
                <p className="pl-2">Tavlen kunne ikke hentes!</p>
            </div>
        </div>
    )
}

export default NotFoundPage
