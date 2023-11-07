import { useNonNullContext } from 'hooks/useNonNullContext'
import { DeparturesContext } from '../../contexts'
import { TableColumn } from '../TableColumn'
import { TableRow } from '../TableRow'
import classes from './styles.module.css'
import { TravelTag } from 'components/TravelTag'

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
                        <TravelTag
                            transportMode={line.transportMode}
                            publicCode={line.publicCode}
                            publicCodeStyle={{
                                width: `${longestPublicCode + 1}ch`,
                            }}
                        />
                    </div>
                </TableRow>
            ))}
        </TableColumn>
    )
}

export { Line }
