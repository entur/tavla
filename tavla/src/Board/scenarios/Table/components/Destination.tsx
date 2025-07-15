import { useNonNullContext } from 'hooks/useNonNullContext'
import { DeparturesContext } from '../contexts'
import { Situations } from './Situations'
import { TableColumn } from './TableColumn'
import { TableRow } from './TableRow'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { nanoid } from 'nanoid'
import { TSituationFragment } from 'graphql/index'

function filterIdenticalSituations(
    originSituations?: TSituationFragment[],
    departureSituations?: TSituationFragment[],
) {
    if (!originSituations || !departureSituations) {
        return departureSituations ?? []
    }
    const filteredSituations = departureSituations.filter(
        (departureSituation) => {
            let shouldKeep = true
            originSituations.map((originSituation) => {
                if (departureSituation.id === originSituation.id) {
                    shouldKeep = false
                    return
                }
            })
            return shouldKeep
        },
    )

    return filteredSituations
}

function Destination({
    deviations = true,
    situations,
}: {
    deviations?: boolean
    situations?: TSituationFragment[]
}) {
    const departures = useNonNullContext(DeparturesContext)

    const destinations = departures.map((departure) => ({
        destination: departure.destinationDisplay?.frontText ?? '',
        situations: filterIdenticalSituations(situations, departure.situations),
        via:
            departure.destinationDisplay?.via
                ?.filter(isNotNullOrUndefined)
                .join(', ') ?? '',
        key: nanoid(),
    }))
    return (
        <div className="grow overflow-hidden">
            <TableColumn title="Destinasjon">
                {destinations.map((destination) => (
                    <TableRow
                        key={destination.key}
                        className="flex align-middle"
                    >
                        <div className="line-clamp-2 overflow-ellipsis hyphens-auto leading-em-base">
                            {destination.via
                                ? `${destination.destination} via ${destination.via}`
                                : destination.destination}
                        </div>

                        {deviations && (
                            <Situations situations={destination.situations} />
                        )}
                    </TableRow>
                ))}
            </TableColumn>
        </div>
    )
}

function Name() {
    const departures = useNonNullContext(DeparturesContext)

    return (
        <div className="grow overflow-hidden">
            <TableColumn title="Stoppested">
                {departures.map((departure) => (
                    <TableRow key={nanoid()}>
                        <div className="line-clamp-2 justify-items-end overflow-ellipsis hyphens-auto text-em-base/em-base">
                            {departure.quay.name}
                        </div>
                    </TableRow>
                ))}
            </TableColumn>
        </div>
    )
}

export { Destination, Name }
