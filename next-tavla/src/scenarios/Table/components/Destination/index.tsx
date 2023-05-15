import { Situation } from '../Situation'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { DepartureContext } from '../../contexts'
import classes from './styles.module.css'

function Destination() {
    const departure = useNonNullContext(DepartureContext)

    return (
        <td>
            <div className={classes.destination}>
                <div>{departure.destinationDisplay?.frontText}</div>
                {departure.situations.map((situation) => (
                    <Situation key={situation.id} situation={situation} />
                ))}
            </div>
        </td>
    )
}
export { Destination }
