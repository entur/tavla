import { TSituationFragment } from 'graphql/index'
import { sortBy } from 'lodash'
import { useCycler } from '../useCycler'
import { Situation } from './Situation'

function Situations({ situations }: { situations: TSituationFragment[] }) {
    const index = useCycler(situations)
    const numberOfSituations = situations.length

    if (!situations.length) return null
    const sortedSituations = sortBy(situations, (s) => s.summary[0]?.value)
    return (
        <Situation situation={sortedSituations[index % numberOfSituations]} />
    )
}
export { Situations }
