import React from 'react'
import { SituationInfo } from 'components/SituationInfo/SituationInfo'
import { TransportModeIcon } from 'components/TransportModeIcon/TransportModeIcon'
import { Departure } from 'logic/use-stop-place-with-estimated-calls/departure'
import { IconColorType } from 'src/types'
import { getIconColor } from 'utils/icon'
import { isDarkOrDefaultTheme } from 'utils/utils'
import { useSettings } from 'settings/SettingsProvider'
import { differenceInCalendarDays } from 'date-fns'
import { DateDisplay } from 'components/DateDisplay'
import classes from './ResponsiveTableRow.module.scss'

const ResponsiveTableRow: React.FC<{ departure: Departure }> = ({
    departure,
}) => {
    const [settings] = useSettings()
    const iconColor = getIconColor(
        departure.transportMode,
        isDarkOrDefaultTheme(settings.theme)
            ? IconColorType.CONTRAST
            : IconColorType.DEFAULT,
    )

    const departsToday =
        differenceInCalendarDays(
            departure.expectedDepartureTime,
            Date.now(),
        ) === 0

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
                    />
                    <span className={classes.PublicCode}>
                        {departure.publicCode}
                    </span>
                </span>
            </td>
            <td className={classes.DepartureName}>
                {departure.frontText}
                {!settings.hideSituations && (
                    <div className={classes.Situation}>
                        <SituationInfo departure={departure} />
                    </div>
                )}
            </td>

            {!departure.delayed ? (
                <td className={classes.DepartureTime}>
                    {departure.displayTime}
                    {!departsToday && (
                        <DateDisplay
                            date={departure.expectedDepartureTime}
                            className={classes.Date}
                        />
                    )}
                </td>
            ) : (
                <td className={classes.DepartureTime}>
                    <span className={classes.DelayedTime}>
                        {departure.displayTime}
                    </span>
                    <span className={classes.OutdatedTime}>
                        {departure.formattedAimedDepartureTime}
                    </span>
                </td>
            )}
        </tr>
    )
}

export { ResponsiveTableRow }
