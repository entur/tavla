import { useNonNullContext } from 'hooks/useNonNullContext'
import { DeparturesContext } from '../../contexts'
import { TableColumn } from '../TableColumn'
import { TableRow } from '../TableRow'

function Platform() {
    const departures = useNonNullContext(DeparturesContext)

    const platforms = departures.map((departure) => ({
        publicCode: departure.quay.publicCode,
        key: `${departure.serviceJourney.id}_${departure.aimedDepartureTime}`,
    }))

    return (
        <TableColumn title="Platform">
            {platforms.map((platform) => (
                <TableRow key={platform.key}>{platform.publicCode}</TableRow>
            ))}
        </TableColumn>
    )
}

export { Platform }
