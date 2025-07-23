import { useNonNullContext } from 'hooks/useNonNullContext'
import { nanoid } from 'nanoid'
import { DeparturesContext } from '../contexts'
import { TableColumn } from './TableColumn'
import { TableRow } from './TableRow'

function Platform() {
    const departures = useNonNullContext(DeparturesContext)

    const platforms = departures.map((departure) => ({
        publicCode: departure.quay.publicCode,
        key: nanoid(),
    }))

    return (
        <TableColumn title="Plf.">
            {platforms.map((platform) => (
                <TableRow key={platform.key}>{platform.publicCode}</TableRow>
            ))}
        </TableColumn>
    )
}

export { Platform }
