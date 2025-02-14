import { DeparturesContext } from 'Board/scenarios/Table/contexts'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { TableColumn } from '../TableColumn'
import { TableRow } from '../TableRow'
import { FormattedTime } from './components/FormattedTime'
import { nanoid } from 'nanoid'

function ArrivalTime() {
    const departures = useNonNullContext(DeparturesContext)

    const time = departures.map((departure) => ({
        expectedArrivalTime: departure.expectedArrivalTime,
        key: nanoid(),
    }))

    return (
        <TableColumn title="Ankomst" className="text-right">
            {time.map((t) => (
                <TableRow key={t.key}>
                    <FormattedTime time={t.expectedArrivalTime} />
                </TableRow>
            ))}
        </TableColumn>
    )
}

export { ArrivalTime }
