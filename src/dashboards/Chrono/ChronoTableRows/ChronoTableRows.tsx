import React, { Fragment } from 'react'
import { Heading3 } from '@entur/typography'
import { DataCell, TableBody, TableRow } from '@entur/table'
import { IconColorType } from '../../../types'
import { createTileSubLabel } from '../../../utils/utils'
import { getIcon } from '../../../utils/icon'
import { NewDayTableRow } from '../../../components/NewDayTableRow/NewDayTableRow'
import { SubLabelIcon } from '../../../components/SubLabelIcon/SubLabelIcon'
import { Departure } from '../../../logic/use-stop-place-with-estimated-calls/departure'
import classes from './ChronoTableRows.module.scss'

interface ChronoTableRowsProps {
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
                const icon = getIcon(
                    data.transportMode,
                    iconColorType,
                    data.transportSubmode,
                )
                const subLabel = createTileSubLabel(data)
                const previousRow = visibleDepartures[index - 1]

                return (
                    <Fragment key={data.id}>
                        <NewDayTableRow
                            currentDate={data.departureTime}
                            previousDate={previousRow?.departureTime}
                        />
                        <TableRow className={classes.ChronoTableRow}>
                            <DataCell>
                                <div className={classes.Icon}>{icon}</div>
                            </DataCell>
                            <DataCell className={classes.DataCell}>
                                <Heading3 as="div" className={classes.Label}>
                                    {data.route}
                                </Heading3>
                            </DataCell>
                            <DataCell className={classes.DataCell}>
                                <div className={classes.Sublabel}>
                                    {subLabel.time}
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
