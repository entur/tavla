import { useNonNullContext } from 'hooks/useNonNullContext'
import { DeparturesContext } from '../../contexts'
import { TableColumn } from '../TableColumn'
import { TableRow } from '../TableRow'
import classes from './styles.module.css'
import { transportModeNames } from 'Admin/utils/transport'
import { TransportIcon } from '../TransportIcon'

function Line() {
    const departures = useNonNullContext(DeparturesContext)

    const lines = departures.map((departure) => ({
        transportMode: departure.serviceJourney.transportMode ?? 'unknown',
        publicCode: departure.serviceJourney.line.publicCode ?? '',
        key: `${departure.serviceJourney.id}_${departure.aimedDepartureTime}`,
    }))

    const longestPublicCode = lines.reduce(
        (longest, line) =>
            line.publicCode.length > longest ? line.publicCode.length : longest,
        0,
    )

    return (
        <TableColumn title="Linje">
            {lines.map((line) => (
                <TableRow key={line.key}>
                    <div className={classes.row}>
                        <div
                            aria-label={`${
                                transportModeNames[line.transportMode]
                            } - linje ${line.publicCode}`}
                            className={classes.line}
                            style={{
                                backgroundColor: `var(--table-transport-${
                                    line.transportMode ?? 'unknown'
                                }-color)`,
                            }}
                        >
                            <TransportIcon
                                key={line.transportMode}
                                transport={line.transportMode}
                                inTravelTag
                            />

                            <div
                                className="textCenter"
                                style={{
                                    width: `${longestPublicCode + 1}ch`,
                                }}
                            >
                                {line.publicCode}
                            </div>
                        </div>
                    </div>
                </TableRow>
            ))}
        </TableColumn>
    )
}

export { Line }
