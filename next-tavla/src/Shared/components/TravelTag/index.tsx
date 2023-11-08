import { transportModeNames } from 'Admin/utils/transport'
import { TTransportMode } from 'types/graphql-schema'
import classes from './styles.module.css'
import { TransportIcon } from 'components/TransportIcon'

function TravelTag({
    transportMode,
    publicCode,
}: {
    transportMode: TTransportMode
    publicCode: string
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
                className="p-05 w-100 h-100"
                transport={transportMode}
                color="var(--main-background-color)"
            />
            <div className="flexRow alignCenter justifyCenter w-100 h-100">
                {publicCode}
            </div>
        </div>
    )
}

export { TravelTag }
