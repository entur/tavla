import { Situation } from '../Situation'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { DepartureContext } from '../../contexts'
import { useEffect, useState } from 'react'

function Situations() {
    const departure = useNonNullContext(DepartureContext)

    const numberOfSituations = departure.situations.length
    const [index, setIndex] = useState(0)

    useEffect(() => {
        if (numberOfSituations <= 1) {
            return
        }
        const interval = setInterval(() => setIndex((i) => i + 1), 5000)
        return () => clearInterval(interval)
    }, [numberOfSituations])

    return (
        <td>
            {numberOfSituations ? (
                <Situation
                    situation={departure.situations[index % numberOfSituations]}
                />
            ) : null}
        </td>
    )
}
export { Situations }
