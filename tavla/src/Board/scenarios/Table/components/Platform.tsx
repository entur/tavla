import { useNonNullContext } from 'hooks/useNonNullContext'
import { nanoid } from 'nanoid'
import { DeparturesContext } from '../contexts'
import { TableCell } from './TableCell'
import { TableColumn } from './TableColumn'

function Platform() {
    const departures = useNonNullContext(DeparturesContext)

    const platforms = departures.map((departure) => ({
        publicCode: departure.quay.publicCode,
        key: nanoid(),
    }))

    return (
        <TableColumn title="Plattform">
            {platforms.map((platform) => (
                <TableCell key={platform.key}>{platform.publicCode}</TableCell>
            ))}
        </TableColumn>
    )
}

export { Platform }
