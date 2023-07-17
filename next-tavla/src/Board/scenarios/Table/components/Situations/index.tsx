import { Situation } from '../Situation'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { DepartureContext } from '../../contexts'
import { useEffect, useState } from 'react'

function Situations() {
    const departure = useNonNullContext(DepartureContext)

    const situations = departure.situations.map((situation) => (
        <Situation key={situation.id} situation={situation} />
    ))

    const nSituations = situations.length
    const [index, setIndex] = useState(0)

    useEffect(() => {
        if (nSituations < 1) {
            return
        }
        const interval = setInterval(
            () => setIndex((i) => (i + 1) % nSituations),
            5000,
        )
        return () => clearInterval(interval)
    }, [nSituations])

    return (
        <td>
            <div>
                {situations.length > 1 ? situations[index] : situations[0]}
            </div>
        </td>
    )
}
export { Situations }
