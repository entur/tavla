import { useNonNullContext } from 'hooks/useNonNullContext'
import { DeparturesContext } from '../../contexts'
import { TableColumn } from '../TableColumn'
import { TableRow } from '../TableRow'
import { Pulse } from 'components/Pulse'

function RealTime() {
    const departures = useNonNullContext(DeparturesContext)

    const realtimes = departures.map((departure) => ({
        realtime: departure.realtime,
        key: `${departure.serviceJourney.id}_${departure.aimedDepartureTime}`,
    }))

    return (
        <TableColumn title="Sanntid">
            {realtimes.map((realtime) => (
                <TableRow key={realtime.key}>
                    {realtime.realtime && <Pulse />}
                </TableRow>
            ))}
        </TableColumn>
    )
}

export { RealTime }
