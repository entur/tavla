import React, { Fragment } from 'react'
import { Departure, IconColorType } from 'src/types'
import { createTileSubLabel } from 'utils/utils'
import { NewDayTableRow } from 'components/NewDayTableRow'
import { SubLabelIcon } from 'components/SubLabelIcon'
import { TransportModeIcon } from 'assets/icons/TransportModeIcon'
import { DataCell, TableBody, TableRow } from '@entur/table'
import { Heading3 } from '@entur/typography'
import classes from './ChronoTableRows.module.scss'

type ChronoTableRowsProps = {
    visibleDepartures: Departure[]
    hideSituations: boolean
    hideTracks: boolean
    iconColorType: IconColorType
}

function ChronoTableRows({
    visibleDepartures,
    hideSituations,
    hideTracks,
    iconColorType,
}: ChronoTableRowsProps): JSX.Element {
    return (
        <TableBody>
            {visibleDepartures.map((data, index) => {
                const subLabel = createTileSubLabel(data)
                const previousRow = visibleDepartures[index - 1]

                return (
                    <Fragment key={data.id}>
                        <NewDayTableRow
                            currentDate={data.expectedDepartureTime}
                            previousDate={previousRow?.expectedDepartureTime}
                        />
                        <TableRow className={classes.ChronoTableRow}>
                            <DataCell>
                                <div className={classes.Icon}>
                                    <TransportModeIcon
                                        transportMode={data.transportMode}
                                        iconColorType={iconColorType}
                                        transportSubmode={data.transportSubmode}
                                    />
                                </div>
                            </DataCell>
                            <DataCell className={classes.DataCell}>
                                <Heading3 as="div" className={classes.Label}>
                                    {data.route}
                                </Heading3>
                            </DataCell>
                            <DataCell className={classes.DataCell}>
                                <div className={classes.Sublabel}>
                                    {subLabel.displayTime}
                                </div>
                            </DataCell>
                            {!hideTracks && (
                                <DataCell className={classes.DataCell}>
                                    <div className={classes.Sublabel}>
                                        {data.quay?.publicCode || '-'}
                                    </div>
                                </DataCell>
                            )}
                            {!hideSituations && (
                                <DataCell className={classes.DataCell}>
                                    <div className={classes.Sublabel}>
                                        <SubLabelIcon
                                            hideSituations={hideSituations}
                                            subLabel={subLabel}
                                        />
                                    </div>
                                </DataCell>
                            )}
                        </TableRow>
                    </Fragment>
                )
            })}
        </TableBody>
    )
}

export { ChronoTableRows }
