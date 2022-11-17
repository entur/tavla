import React, { Fragment } from 'react'
import { Heading3 } from '@entur/typography'
import { DataCell, TableBody, TableRow } from '@entur/table'
import { ValidationExclamation } from '../../../assets/icons/ValidationExclamation'
import { ValidationError } from '../../../assets/icons/ValidationError'
import { IconColorType, LineData, TileSubLabel } from '../../../types'
import { SituationModal } from '../../../components/SituationModal/SituationModal'
import { createTileSubLabel, isMobileWeb } from '../../../utils/utils'
import { getIcon } from '../../../utils/icon'
import { NewDayTableRow } from '../../../components/NewDayTableRow/NewDayTableRow'
import classes from './ChronoTableRows.module.scss'

const isMobile = isMobileWeb()

interface ChronoTableRowsProps {
    visibleDepartures: LineData[]
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
                const icon = getIcon(data.type, iconColorType, data.subType)
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

function SubLabelIcon({
    subLabel,
    hideSituations,
}: {
    subLabel: TileSubLabel
    hideSituations?: boolean
}): JSX.Element | null {
    if (!hideSituations && subLabel?.situation)
        if (isMobile)
            return (
                <div>
                    <SituationModal situationMessage={subLabel.situation} />
                </div>
            )
        else
            return (
                <div>
                    <ValidationExclamation />
                </div>
            )

    if (subLabel.hasCancellation)
        return (
            <div className={classes.Cancellation}>
                <ValidationError />
            </div>
        )
    return null
}

export { ChronoTableRows }
