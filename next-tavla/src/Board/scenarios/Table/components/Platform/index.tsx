import { TableColumn } from '../TableColumn'
import { TableRow } from '../TableRow'

function Platform({
    platforms,
}: {
    platforms: { publicCode: string | null; key: string }[]
}) {
    return (
        <TableColumn title="Platform">
            {platforms.map((platform) => (
                <TableRow key={platform.key}>{platform.publicCode}</TableRow>
            ))}
        </TableColumn>
    )
}

export { Platform }
