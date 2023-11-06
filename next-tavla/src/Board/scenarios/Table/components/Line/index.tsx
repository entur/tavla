import { useNonNullContext } from 'hooks/useNonNullContext'
import { DeparturesContext } from '../../contexts'
import { TableColumn } from '../TableColumn'
import { TableRow } from '../TableRow'
import classes from './styles.module.css'
import { TTransportMode } from 'types/graphql-schema'
import { TravelTag } from 'components/TravelTag'

function Line({
    showPublicCode,
    showTransportMode,
}: {
    line?: string
    transportMode?: TTransportMode
    showPublicCode: boolean
    showTransportMode: boolean
}) {
    const departures = useNonNullContext(DeparturesContext)

    if (!showPublicCode && !showTransportMode) return null

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
        <TableColumn title={showPublicCode ? 'Linje' : 'Transportmiddel'}>
            {lines.map((line) => (
                <TableRow key={line.key}>
                    <div className={classes.row}>
                        <TravelTag
                            transportMode={line.transportMode}
                            publicCode={line.publicCode}
                            publicCodeStyle={{
                                width: `${longestPublicCode + 1}ch`,
                            }}
                            showPublicCode={showPublicCode}
                            showTransportMode={showTransportMode}
                        />
                    </div>
                </TableRow>
            ))}
        </TableColumn>
    )
}

export { Line }
