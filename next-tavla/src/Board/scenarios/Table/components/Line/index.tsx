import { useNonNullContext } from 'hooks/useNonNullContext'
import { DeparturesContext } from '../../contexts'
import { TableColumn } from '../TableColumn'
import { TableRow } from '../TableRow'
import { TravelTag } from 'components/TravelTag'

function Line() {
    const departures = useNonNullContext(DeparturesContext)

    const lines = departures.map((departure) => ({
        transportMode: departure.serviceJourney.transportMode ?? 'unknown',
        transportSubmode:
            departure.serviceJourney.transportSubmode ?? undefined,
        publicCode: departure.serviceJourney.line.publicCode ?? '',
        key: `${departure.serviceJourney.id}_${departure.aimedDepartureTime}`,
    }))

    return (
        <TableColumn title="Linje">
            {lines.map((line) => (
                <TableRow key={line.key}>
                    <div className="flex gap-2 justify-start items-center pr-2 w-full">
                        <TravelTag
                            transportMode={line.transportMode}
                            transportSubmode={line.transportSubmode}
                            publicCode={line.publicCode}
                        />
                    </div>
                </TableRow>
            ))}
        </TableColumn>
    )
}

export { Line }
