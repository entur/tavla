import { useNonNullContext } from 'hooks/useNonNullContext'
import { DeparturesContext } from '../contexts'
import { Situations } from './Situations'
import { TableColumn } from './TableColumn'
import { TableRow } from './TableRow'

function Deviation({ situations = true }: { situations?: boolean }) {
    const departures = useNonNullContext(DeparturesContext)

    const deviations = departures.map((departure) => ({
        situations: departure.situations ?? [],
        key: `${departure.serviceJourney.id}_${departure.aimedDepartureTime}`,
    }))
    return (
        <TableColumn title="Avvik" className="grow">
            {deviations.map((deviation) => (
                <TableRow key={deviation.key}>
                    {situations && (
                        <Situations situations={deviation.situations} />
                    )}
                </TableRow>
            ))}
        </TableColumn>
    )
}

export { Deviation }
