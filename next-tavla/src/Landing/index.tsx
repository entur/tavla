import { Button } from '@entur/button'
import { Contrast } from '@entur/layout'
import classes from './styles.module.css'

function Landing() {
    return (
        <Contrast>
            <div className={classes.container}>
                <h1>Fin overskrift</h1>
                <Button variant="primary">Opprett ny tavle</Button>
            </div>
        </Contrast>
    )
}

export default Landing
