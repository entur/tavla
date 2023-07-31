import { Situation } from '../Situation'
import { useEffect, useState } from 'react'
import { TSituationFragment } from 'graphql/index'

function Situations({ situations }: { situations: TSituationFragment[] }) {
    const [index, setIndex] = useState(0)

    const numberOfSituations = situations.length

    useEffect(() => {
        if (numberOfSituations <= 1) {
            return
        }
        const interval = setInterval(() => setIndex((i) => i + 1), 5000)
        return () => clearInterval(interval)
    }, [numberOfSituations])

    if (!situations.length) return null
    return <Situation situation={situations[index % numberOfSituations]} />
}
export { Situations }
