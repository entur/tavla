import { DeparturesContext } from 'Board/scenarios/Table/contexts'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { nanoid } from 'nanoid'
import { TableCell } from '../TableCell'
import { TableColumn } from '../TableColumn'
import { FormattedTime } from './components/FormattedTime'

function ArrivalTime() {
    const departures = useNonNullContext(DeparturesContext)

    const time = departures.map((departure) => ({
        expectedArrivalTime: departure.expectedArrivalTime,
        key: nanoid(),
    }))

    return (
        <TableColumn title="Ankomst" className="text-right">
            {time.map((t) => (
                <TableCell key={t.key}>
                    <FormattedTime time={t.expectedArrivalTime} />
                </TableCell>
            ))}
        </TableColumn>
    )
}

export { ArrivalTime }
