import { useNonNullContext } from 'hooks/useNonNullContext'
import { DepartureContext } from '../../contexts'
import classes from './styles.module.css'

function Line() {
    const departure = useNonNullContext(DepartureContext)

    const mode = departure.serviceJourney.transportMode ?? 'unknown'
    const transportModeColor = `var(--table-transport-${mode}-color)`

    const publicCode = departure.serviceJourney.line.publicCode

    return (
        <td>
            <div
                className={classes.lineWrapper}
                style={{
                    backgroundColor: transportModeColor,
                }}
            >
                {publicCode}
            </div>
        </td>
    )
}

export { Line }
