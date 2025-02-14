import { useNonNullContext } from 'hooks/useNonNullContext'
import { DeparturesContext } from '../contexts'
import { TableColumn } from './TableColumn'
import { TableRow } from './TableRow'
import { nanoid } from 'nanoid'

function Platform() {
    const departures = useNonNullContext(DeparturesContext)

    const platforms = departures.map((departure) => ({
        publicCode: departure.quay.publicCode,
        key: nanoid(),
    }))

    return (
        <TableColumn title="Plattform">
            {platforms.map((platform) => (
                <TableRow key={platform.key}>{platform.publicCode}</TableRow>
            ))}
        </TableColumn>
    )
}

export { Platform }
