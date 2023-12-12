import { Situation } from './Situation'
import { TSituationFragment } from 'graphql/index'
import { useCycler } from '../useCycler'

function Situations({ situations }: { situations: TSituationFragment[] }) {
    const index = useCycler(situations)
    const numberOfSituations = situations.length

    if (!situations.length) return null
    return <Situation situation={situations[index % numberOfSituations]} />
}
export { Situations }
