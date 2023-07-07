import { TDepartureFragment } from 'graphql/index'
import { TransportIcon } from '../TransportIcon'
import classes from './styles.module.css'

function TableHeader({
    name,
    departures,
}: {
    name: string
    departures: TDepartureFragment[]
}) {
    const transportModes = departures.map(
        (departures) => departures.serviceJourney.transportMode,
    )
    const unique = transportModes.filter((x, i, a) => a.indexOf(x) == i)

    return (
        <div className={classes.headerWrapper}>
            <h3>{name}</h3>
            <div className={classes.transportWrapper}>
                {unique.map((transport) => (
                    <TransportIcon key={transport} transportMode={transport} />
                ))}
            </div>
        </div>
    )
}

export { TableHeader }
