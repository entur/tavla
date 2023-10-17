import { DeparturesContext } from 'Board/scenarios/Table/contexts'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { TableColumn } from '../../TableColumn'
import { TableRow } from '../../TableRow'
import { formatDateString } from 'utils/time'

function ArrivalTime() {
    const departures = useNonNullContext(DeparturesContext)

    const time = departures.map((departure) => ({
        expectedArrivalTime: departure.expectedArrivalTime,
        key: `${departure.serviceJourney.id}_${departure.expectedArrivalTime}`,
    }))

    return (
        <TableColumn title="Ankomst" className="textRight">
            {time.map((t) => (
                <TableRow key={t.key}>
                    <div className="textRight weight600">
                        {formatDateString(t.expectedArrivalTime)}
                    </div>
                </TableRow>
            ))}
        </TableColumn>
    )
}

export { ArrivalTime }
