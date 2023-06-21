import { Contrast } from '@entur/layout'
import Landing from '../src/Admin/scenarios/Landing'
import classes from 'styles/landing.module.css'
import { Header } from 'components/Header'

function LandingPage() {
    return (
        <Contrast className={classes.root}>
            <Header />
            <Landing />
        </Contrast>
    )
}

export default LandingPage
