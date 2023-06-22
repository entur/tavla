import { Header } from 'components/Header'
import classes from 'styles/pages/board.module.css'

function NotFoundPage() {
    return (
        <div className={classes.root}>
            <div className={classes.rootContainer}>
                <Header />
                <p className="pl-2">Tavlen kunne ikke hentes!</p>
            </div>
        </div>
    )
}

export default NotFoundPage
