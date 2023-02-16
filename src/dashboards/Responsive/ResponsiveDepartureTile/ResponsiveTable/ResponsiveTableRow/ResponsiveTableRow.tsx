import React from 'react'
import { SituationInfo } from 'components/SituationInfo/SituationInfo'
import { TransportModeIcon } from 'components/TransportModeIcon/TransportModeIcon'
import { Departure } from 'logic/use-stop-place-with-estimated-calls/departure'
import { IconColorType, Theme } from 'src/types'
import { getIconColor } from 'utils/icon'
import { useSettings } from 'settings/SettingsProvider'
import classes from './ResponsiveTableRow.module.scss'

const ResponsiveTableRow: React.FC<{ departure: Departure }> = ({
    departure,
}) => {
    const [settings] = useSettings()
    const iconColor = getIconColor(
        departure.transportMode,
        settings.theme == Theme.DEFAULT || settings.theme == Theme.DARK
            ? IconColorType.CONTRAST
            : IconColorType.DEFAULT,
    )

    return (
        <tr className={classes.TableRow}>
            <td>
                <span
                    className={classes.RouteNumber}
                    style={{
                        backgroundColor: iconColor,
                    }}
                >
                    <TransportModeIcon
                        transportMode={departure.transportMode}
                        color="inherit"
                        className={classes.TransportModeIcon}
                    />
                    <span className={classes.PublicCode}>
                        {departure.publicCode}
                    </span>
                </span>
            </td>
            <td className={classes.DepartureName}>
                {departure.frontText}
                <div className={classes.Situation}>
                    <SituationInfo departure={departure} />
                </div>
            </td>
            <td className={classes.DepartureTime}>{departure.displayTime}</td>
        </tr>
    )
}

export { ResponsiveTableRow }
