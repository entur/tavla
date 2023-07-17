import { useNonNullContext } from 'hooks/useNonNullContext'
import { DepartureContext } from '../../contexts'
import classes from './styles.module.css'

function Platform() {
    const departure = useNonNullContext(DepartureContext)

    return <td className={classes.quayText}>{departure.quay.publicCode}</td>
}

export { Platform }
