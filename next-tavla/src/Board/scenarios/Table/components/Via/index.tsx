import { useNonNullContext } from 'hooks/useNonNullContext'
import { DepartureContext } from '../../contexts'
import classes from './styles.module.css'

function Via() {
    const departure = useNonNullContext(DepartureContext)

    const viaDestinations = departure.destinationDisplay?.via

    function stringifyViaDestinations(viaDest: typeof viaDestinations) {
        if (!viaDest || !viaDest.length) return null

        return viaDest.reduce((prev, next) => {
            if (!prev) return next
            if (!next) return prev
            return prev + ', ' + next
        })
    }

    return (
        <td className={classes.via}>
            {stringifyViaDestinations(viaDestinations)}
        </td>
    )
}

export { Via }
