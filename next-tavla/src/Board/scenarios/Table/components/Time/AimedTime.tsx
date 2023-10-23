import { useNonNullContext } from 'hooks/useNonNullContext'
import { formatDateString } from 'utils/time'
import { DeparturesContext } from 'Board/scenarios/Table/contexts'
import { TableColumn } from '../TableColumn'
import { TableRow } from '../TableRow'

function AimedTime() {
    const departures = useNonNullContext(DeparturesContext)

    const time = departures.map((departure) => ({
        aimedDepartureTime: departure.aimedDepartureTime,
        key: `${departure.serviceJourney.id}_${departure.aimedDepartureTime}`,
    }))

    return (
        <TableColumn title="Planlagt" className="textRight">
            {time.map((t) => (
                <TableRow key={t.key}>
                    <div className="textRight weight600">
                        {formatDateString(t.aimedDepartureTime)}
                    </div>
                </TableRow>
            ))}
        </TableColumn>
    )
}

export { AimedTime }
