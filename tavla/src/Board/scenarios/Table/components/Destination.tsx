import { useNonNullContext } from 'hooks/useNonNullContext'
import { nanoid } from 'nanoid'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { DeparturesContext } from '../contexts'
import { TableCell } from './TableCell'
import { TableColumn } from './TableColumn'

function Destination() {
    const departures = useNonNullContext(DeparturesContext)

    const destinations = departures.map((departure) => ({
        destination: departure.destinationDisplay?.frontText ?? '',
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
                    <TableCell
                        key={destination.key}
                        className="flex align-middle"
                    >
                        <div className="line-clamp-1 overflow-ellipsis hyphens-auto text-em-xl2 leading-em-base">
                            {destination.via
                                ? `${destination.destination} via ${destination.via}`
                                : destination.destination}
                        </div>
                    </TableCell>
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
                {departures.map((departure) => {
                    // Check if this departure has tile info with custom display name
                    const tileInfo =
                        'tileInfo' in departure ? departure.tileInfo : undefined
                    const shouldUseCustomName =
                        tileInfo?.useDisplayNameInCombined &&
                        tileInfo?.displayName
                    const displayName = shouldUseCustomName
                        ? tileInfo.displayName
                        : departure.quay.name

                    return (
                        <TableCell key={nanoid()}>
                            <div className="line-clamp-2 justify-items-end overflow-ellipsis hyphens-auto text-em-base/em-base">
                                {displayName}
                            </div>
                        </TableCell>
                    )
                })}
            </TableColumn>
        </div>
    )
}

export { Destination, Name }
