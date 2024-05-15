import { TSituationFragment } from 'graphql/index'
import { useCycler } from '../../useCycler'
import { Situation } from '../Situation'

function StopPlaceDeviation({
    situations,
}: {
    situations?: TSituationFragment[]
}) {
    const index = useCycler(situations)
    const numberOfSituations = situations?.length ?? 0

    if (!situations || numberOfSituations === 0) return null

    return (
        <div className="pb-[0.5em]">
            <Situation situation={situations[index % numberOfSituations]} />
        </div>
    )
}

export { StopPlaceDeviation }
