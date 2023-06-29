import { Situation } from '../Situation'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { DepartureContext } from '../../contexts'
import classes from './styles.module.css'

function Situations() {
    const departure = useNonNullContext(DepartureContext)

    return (
        <td>
            <div>
                <div className={classes.situationsWrapper}>
                    {departure.situations.map((situation) => (
                        <Situation key={situation.id} situation={situation} />
                    ))}
                    {/* {departure.situations.map((situation) => (
                        <Situation key={situation.id} situation={situation} />
                    ))} */}
                </div>
            </div>
        </td>
    )
}
export { Situations }
