import { TDepartureFragment } from 'graphql/index'

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
        <div>
            <h3>{name}</h3>
            <div>{unique}</div>
        </div>
    )
}

export { TableHeader }
