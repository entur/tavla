import { TSituationFragment } from 'graphql/index'
import { useCycler } from '../../useCycler'
import { Situation } from '../Situation'
import classes from './styles.module.css'

function StopPlaceDeviation({
    situations,
}: {
    situations?: TSituationFragment[]
}) {
    const index = useCycler(situations)
    const numberOfSituations = situations?.length ?? 0

    if (!situations || numberOfSituations === 0) return null

    return (
        <div className={classes.deviation}>
            <Situation situation={situations[index % numberOfSituations]} />
        </div>
    )
}

export { StopPlaceDeviation }
