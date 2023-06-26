import { useNonNullContext } from 'hooks/useNonNullContext'
import { DepartureContext } from '../../contexts'
import classes from './styles.module.css'

function Destination() {
    const departure = useNonNullContext(DepartureContext)

    return (
        <td>
            <div className={classes.destination}>
                <div>{departure.destinationDisplay?.frontText}</div>
            </div>
        </td>
    )
}
export { Destination }
