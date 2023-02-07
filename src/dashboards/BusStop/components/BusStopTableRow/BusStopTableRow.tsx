import React from 'react'
import { Departure } from 'logic/use-stop-place-with-estimated-calls/departure'
import { DataCell, TableRow } from '@entur/table'
import { SituationInfo } from '../SituationInfo/SituationInfo'
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
    return (
        <TableRow className={classes.TableRow}>
            <DataCell className={classes.Line}>{departure.publicCode}</DataCell>
            <DataCell className={classes.Route}>{departure.frontText}</DataCell>
            <DataCell className={classes.Time}>
                {!departure.delayed ? (
                    departure.displayTime
                ) : (
                    <>
                        <span className={classes.DelayedTime}>
                            {departure.displayTime}
                        </span>
                        <span className={classes.OutdatedTime}>
                            {departure.formattedAimedDepartureTime}
                        </span>
                    </>
                )}
            </DataCell>
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
