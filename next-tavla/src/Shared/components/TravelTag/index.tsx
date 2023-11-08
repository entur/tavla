import { transportModeNames } from 'Admin/utils/transport'
import { TTransportMode } from 'types/graphql-schema'
import classes from './styles.module.css'
import { TransportIcon } from 'components/TransportIcon'

function TravelTag({
    transportMode,
    publicCode,
    showPublicCode = true,
    showTransportMode = true,
    publicCodeStyle,
}: {
    transportMode: TTransportMode
    publicCode: string
    showPublicCode?: boolean
    showTransportMode?: boolean
    publicCodeStyle?: React.CSSProperties
}) {
    if (!showTransportMode && !showPublicCode) return null

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
            {showTransportMode && (
                <TransportIcon
                    className={classes.icon}
                    transport={transportMode}
                    color="var(--main-background-color)"
                />
            )}

            {showPublicCode && (
                <div className="textCenter" style={publicCodeStyle}>
                    {publicCode}
                </div>
            )}
        </div>
    )
}

export { TravelTag }
