import { useNonNullContext } from 'hooks/useNonNullContext'
import { getPresentation } from 'Board/utils/colors'
import { DepartureContext } from '../../contexts'
import classes from './styles.module.css'

function Line() {
    const departure = useNonNullContext(DepartureContext)

    const presentation = getPresentation(
        departure.serviceJourney.line.presentation,
        departure.serviceJourney.line.id,
        departure.serviceJourney.transportMode,
    )

    const publicCode = departure.serviceJourney.line.publicCode

    return (
        <td>
            <div
                className={classes.lineWrapper}
                style={{
                    backgroundColor: presentation.backgroundColor,
                    color: presentation.color,
                }}
            >
                {publicCode}
            </div>
        </td>
    )
}

export { Line }
