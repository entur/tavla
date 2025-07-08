import { TSituationFragment } from 'graphql/index'
import { useCycler } from '../../useCycler'
import { TitleSituation } from '../Situation'

function StopPlaceDeviation({
    situations,
}: {
    situations?: TSituationFragment[]
}) {
    const index = useCycler(situations, 10000)
    const numberOfSituations = situations?.length ?? 0

    return (
        <div className="mt-[-1em] min-h-[1.5em]">
            {situations && numberOfSituations > 0 && (
                <TitleSituation
                    situation={situations[index % numberOfSituations]}
                />
            )}
        </div>
    )
}

export { StopPlaceDeviation }
