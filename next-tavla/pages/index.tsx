import { Landing } from '../src/Admin/scenarios/Landing'
import classes from 'styles/pages/landing.module.css'
import { Header } from 'components/Header'

function LandingPage() {
    return (
        <div className={classes.root}>
            <Header className={classes.header} />
            <Landing />
        </div>
    )
}

export default LandingPage
