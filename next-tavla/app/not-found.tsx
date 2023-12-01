import { NotFound } from 'Admin/components/NotFound'
import { Header } from 'components/Header'
import classes from 'styles/pages/board.module.css'

function BoardNotFoundPage() {
    return (
        <div className={classes.root}>
            <Header />
            <NotFound
                title="Fant ikke tavlen!"
                description="Ingen tavler samsvarer med URL'en. Kontroller at adressen er riktig, og at tavlen ikke er slettet."
            />
        </div>
    )
}

export default BoardNotFoundPage
