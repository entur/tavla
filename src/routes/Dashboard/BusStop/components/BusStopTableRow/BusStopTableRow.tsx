import React from 'react'
import { Departure } from 'logic/use-stop-place-with-estimated-calls/departure'
import { SituationInfo } from 'components/SituationInfo/SituationInfo'
import { DateDisplay } from 'components/DateDisplay'
import { differenceInCalendarDays } from 'date-fns'
import { DataCell, TableRow } from '@entur/table'
import classes from './BusStopTableRow.module.scss'

interface Props {
    departure: Departure
    hideSituations: boolean | undefined
    hideTracks: boolean | undefined
}

function BusStopTableRow({
    departure,
    hideSituations,
    hideTracks,
}: Props): JSX.Element {
    const departsToday =
        differenceInCalendarDays(
            departure.expectedDepartureTime,
            Date.now(),
        ) === 0

    return (
        <TableRow className={classes.TableRow}>
            <DataCell className={classes.Line}>{departure.publicCode}</DataCell>
            <DataCell className={classes.Route}>{departure.frontText}</DataCell>
            {!departure.delayed ? (
                <DataCell className={classes.Time}>
                    {departure.displayTime}
                    {!departsToday && (
                        <DateDisplay
                            className={classes.DateDisplay}
                            date={departure.expectedDepartureTime}
                        />
                    )}
                </DataCell>
            ) : (
                <DataCell className={classes.Time}>
                    <span className={classes.DelayedTime}>
                        {departure.displayTime}
                    </span>
                    <span className={classes.OutdatedTime}>
                        {departure.formattedAimedDepartureTime}
                    </span>
                </DataCell>
            )}
            {!hideTracks && (
                <DataCell className={classes.Track}>
                    {departure.quay?.publicCode || '-'}
                </DataCell>
            )}
            {!hideSituations && (
                <DataCell>
                    <SituationInfo departure={departure} />
                </DataCell>
            )}
        </TableRow>
    )
}

export { BusStopTableRow }
