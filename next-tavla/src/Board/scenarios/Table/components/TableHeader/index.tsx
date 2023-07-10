import { TDepartureFragment } from 'graphql/index'
import { TransportIcon } from '../TransportIcon'
import classes from './styles.module.css'

function TableHeader({
    heading,
    departures,
}: {
    heading: string
    departures: TDepartureFragment[]
}) {
    const uniqueDepartures: TDepartureFragment[] = departures.filter(
        (departure, index, self) => {
            const mode = departure.serviceJourney.transportMode
            const color = departure.serviceJourney.line.presentation?.colour

            if (
                self.findIndex(
                    (d) =>
                        d.serviceJourney.transportMode === mode &&
                        d.serviceJourney.line.presentation?.colour === color,
                ) === index
            ) {
                return true
            }

            return false
        },
    )

    return (
        <div className={classes.headerWrapper}>
            <h3>{heading}</h3>
            <div className={classes.transportWrapper}>
                {uniqueDepartures.map((transport) => (
                    <TransportIcon
                        key={
                            transport.serviceJourney.transportMode +
                            transport.serviceJourney.id +
                            transport.expectedDepartureTime
                        }
                        departure={transport}
                    />
                ))}
            </div>
        </div>
    )
}

export { TableHeader }
