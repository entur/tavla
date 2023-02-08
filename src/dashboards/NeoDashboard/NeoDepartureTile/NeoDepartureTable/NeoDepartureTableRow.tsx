import React from 'react'
import { TransportModeIcon } from 'src/components/TransportModeIcon/TransportModeIcon'
import { SituationInfo } from 'src/dashboards/BusStop/components/SituationInfo/SituationInfo'
import { Departure } from 'src/logic/use-stop-place-with-estimated-calls/departure'
import { IconColorType } from 'src/types'
import { getIconColor } from 'src/utils/icon'
import classes from './NeoDepartureTableRow.module.scss'

interface Props {
    departure: Departure
}

const NeoDepartureTableRow: React.FC<Props> = ({ departure }) => (
    <tr key={departure.id} className={classes.TableRow}>
        <td>
            <span
                className={classes.RouteNumber}
                style={{
                    backgroundColor: getIconColor(
                        departure.transportMode,
                        IconColorType.DEFAULT,
                    ),
                }}
            >
                <TransportModeIcon
                    transportMode={departure.transportMode}
                    color="white"
                />
                {departure.publicCode}
            </span>
        </td>
        <td className={classes.LineName}>
            {departure.frontText}
            <div className={classes.Situation}>
                <SituationInfo departure={departure} />
            </div>
        </td>
        <td>{departure.displayTime}</td>
    </tr>
)

export { NeoDepartureTableRow }
