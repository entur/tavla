import React from 'react'
import { SituationInfo } from 'src/components/SituationInfo/SituationInfo'
import { TransportModeIcon } from 'src/components/TransportModeIcon/TransportModeIcon'
import { Departure } from 'src/logic/use-stop-place-with-estimated-calls/departure'
import { IconColorType } from 'src/types'
import { getIconColor } from 'src/utils/icon'
import classes from './ResponsiveTableRow.module.scss'

const ResponsiveTableRow: React.FC<{ departure: Departure }> = ({
    departure,
}) => {
    const iconColor = getIconColor(
        departure.transportMode,
        IconColorType.DEFAULT,
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
                        color="white"
                    />
                    {departure.publicCode}
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
