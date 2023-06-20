import { Button } from '@entur/button'
import { Contrast } from '@entur/layout'
import {Heading1, Heading2} from "@entur/typography"
import classes from './styles.module.css'

function Landing() {
    return (
        <Contrast>
            <div className={classes.container}>
                <Heading1 className={classes.header}>EnTur Tavla 2.0</Heading1>
                <Heading2 className={classes.header}>Vil du lage din egen tavle????</Heading2>
                <Button variant="primary">Opprett ny tavle</Button>
            </div>
        </Contrast>
    )
}

export default Landing
