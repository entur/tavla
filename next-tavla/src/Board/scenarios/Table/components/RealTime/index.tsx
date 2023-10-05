import { useNonNullContext } from 'hooks/useNonNullContext'
import { DeparturesContext } from '../../contexts'
import classes from './styles.module.css'
import { TableColumn } from '../TableColumn'
import { TableRow } from '../TableRow'

function RealTime() {
    const departures = useNonNullContext(DeparturesContext)

    const realtimes = departures.map((departure) => ({
        realtime: departure.realtime,
        key: `${departure.serviceJourney.id}_${departure.aimedDepartureTime}`,
    }))

    console.log(realtimes)

    return (
        <TableColumn title="Sanntid">
            {realtimes.map((realtime) => (
                <TableRow key={realtime.key}>
                    {realtime.realtime && (
                        <div className="flexColumn alignCenter">
                            <span className={classes.heartbeat}></span>
                            <span className={classes.dot}></span>
                        </div>
                    )}
                </TableRow>
            ))}
        </TableColumn>
    )
}

export { RealTime }
