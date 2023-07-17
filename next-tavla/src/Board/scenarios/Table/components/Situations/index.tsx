import { Situation } from '../Situation'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { DepartureContext } from '../../contexts'
import { useEffect, useState } from 'react'

function Situations() {
    const departure = useNonNullContext(DepartureContext)

    const situations = departure.situations.map((situation) => (
        <Situation key={situation.id} situation={situation} />
    ))

    const numberOfSituations = situations.length
    const [index, setIndex] = useState(0)

    useEffect(() => {
        if (numberOfSituations <= 1) {
            return
        }
        const interval = setInterval(
            () => setIndex((i) => (i + 1) % numberOfSituations),
            5000,
        )
        return () => clearInterval(interval)
    }, [numberOfSituations])

    return (
        <td>
            <div>{situations[index]}</div>
        </td>
    )
}
export { Situations }
