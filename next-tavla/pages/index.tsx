import { Contrast } from '@entur/layout'
import { Landing } from '../src/Admin/scenarios/Landing'
import classes from 'styles/pages/landing.module.css'
import { Header } from 'components/Header'

function LandingPage() {
    return (
        <Contrast className={classes.root}>
            <div className={classes.header}>
                <Header />
            </div>
            <Landing />
        </Contrast>
    )
}

export default LandingPage
