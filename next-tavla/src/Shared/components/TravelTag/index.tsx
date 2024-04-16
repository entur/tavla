import { TTransportMode, TTransportSubmode } from 'types/graphql-schema'
import classes from './styles.module.css'
import { TransportIcon } from 'components/TransportIcon'

const transportModeNames: Record<TTransportMode, string> = {
    air: 'Fly',
    bus: 'Buss',
    cableway: 'Taubane',
    water: 'Båt',
    funicular: 'Kabelbane',
    lift: 'Heis',
    rail: 'Tog',
    metro: 'T-bane',
    tram: 'Trikk',
    trolleybus: 'Trolley-buss',
    monorail: 'Énskinnebane',
    coach: 'Langdistansebuss',
    unknown: 'Ukjent',
}

function TravelTag({
    transportMode,
    publicCode,
    transportSubmode,
}: {
    transportMode: TTransportMode
    publicCode: string
    transportSubmode?: TTransportSubmode
}) {
    return (
        <div
            aria-label={`${transportModeNames[transportMode]} - linje ${publicCode}`}
            className={classes.line}
            style={{
                backgroundColor: `var(--table-transport-${
                    transportMode ?? 'unknown'
                }-color)`,
            }}
        >
            <TransportIcon
                className={classes.icon}
                transportMode={transportMode}
                transportSubmode={transportSubmode}
                color="var(--main-background-color)"
            />
            <div className="flex flex-row items-center justify-center  w-full h-full">
                {publicCode}
            </div>
        </div>
    )
}

export { TravelTag }
