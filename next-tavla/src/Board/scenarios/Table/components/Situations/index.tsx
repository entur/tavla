import { Situation } from '../Situation'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { DepartureContext } from '../../contexts'

function Situations() {
    const departure = useNonNullContext(DepartureContext)

    return (
        <td>
            <div>
                {departure.situations.map((situation) => (
                    <Situation key={situation.id} situation={situation} />
                ))}
            </div>
        </td>
    )
}
export { Situations }
