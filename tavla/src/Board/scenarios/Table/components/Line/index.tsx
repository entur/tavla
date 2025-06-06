import { useNonNullContext } from 'hooks/useNonNullContext'
import { DeparturesContext } from '../../contexts'
import { TableColumn } from '../TableColumn'
import { TableRow } from '../TableRow'
import { TravelTag } from 'components/TravelTag'
import { getAirPublicCode } from 'utils/publicCode'
import { nanoid } from 'nanoid'

function Line() {
    const departures = useNonNullContext(DeparturesContext)

    const lines = departures.map((departure) => ({
        transportMode: departure.serviceJourney.transportMode ?? 'unknown',
        transportSubmode:
            departure.serviceJourney.transportSubmode ?? undefined,
        publicCode: departure.serviceJourney.line.publicCode ?? '',
        key: nanoid(),
        id: departure.serviceJourney.id ?? '',
    }))

    return (
        <TableColumn title="Linje">
            {lines.map((line) => (
                <TableRow key={line.key}>
                    <div className="flex w-full items-center justify-start gap-2 pr-2">
                        <TravelTag
                            transportMode={line.transportMode}
                            transportSubmode={line.transportSubmode}
                            publicCode={
                                line.transportMode === 'air'
                                    ? (getAirPublicCode(line.id) ?? '')
                                    : line.publicCode
                            }
                        />
                    </div>
                </TableRow>
            ))}
        </TableColumn>
    )
}

export { Line }
