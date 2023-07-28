import { TableColumn } from '../TableColumn'
import { TableRow } from '../TableRow'
import classes from './styles.module.css'

function Destination({
    destinations,
}: {
    destinations: { destination: string; key: string }[]
}) {
    return (
        <TableColumn title="Destinasjon" className={classes.grow}>
            {destinations.map((destination) => (
                <TableRow key={destination.key}>
                    {destination.destination}
                </TableRow>
            ))}
        </TableColumn>
    )
}

export { Destination }
