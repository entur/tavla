import { useNonNullContext } from 'hooks/useNonNullContext'
import { DeparturesContext } from 'Board/scenarios/Table/contexts'
import { TableColumn } from '../TableColumn'
import { TableRow } from '../TableRow'
import { FormattedTime } from './components/FormattedTime'
import { nanoid } from 'nanoid'

function AimedTime() {
    const departures = useNonNullContext(DeparturesContext)

    const time = departures.map((departure) => ({
        aimedDepartureTime: departure.aimedDepartureTime,
        key: nanoid(),
    }))

    return (
        <TableColumn title="Planlagt" className="text-right">
            {time.map((t) => (
                <TableRow key={t.key}>
                    <FormattedTime time={t.aimedDepartureTime} />
                </TableRow>
            ))}
        </TableColumn>
    )
}

export { AimedTime }
