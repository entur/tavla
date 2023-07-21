import { Situation } from '../Situation'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { DepartureContext } from '../../contexts'
import { useEffect, useState } from 'react'

function Situations() {
    const departure = useNonNullContext(DepartureContext)

    const situations = departure.situations
    const numberOfSituations = situations.length

    const [index, setIndex] = useState(0)

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
