import React, { Fragment } from 'react'
import { Heading3 } from '@entur/typography'
import { DataCell, TableBody, TableRow } from '@entur/table'
import { ValidationExclamation } from '../../../assets/icons/ValidationExclamation'
import { ValidationError } from '../../../assets/icons/ValidationError'
import { IconColorType, LineData, TileSubLabel } from '../../../types'
import { SituationModal } from '../../../components/SituationModal/SituationModal'
import { createTileSubLabel, isMobileWeb } from '../../../utils/utils'
import { getIcon } from '../../../utils/icon'
import { NewDayTableRow } from '../../../components/DateRow/NewDayTableRow'
import css from './ChronoTableRows.module.scss'

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
                        <TableRow className={css.chronoTableRow}>
                            <DataCell>
                                <div className={css.chronoTableRowIcon}>
                                    {icon}
                                </div>
                            </DataCell>
                            <DataCell className={css.chronoTableRowDataCell}>
                                <Heading3
                                    as="div"
                                    className={css.chronoTableRowLabel}
                                >
                                    {data.route}
                                </Heading3>
                            </DataCell>
                            <DataCell className={css.chronoTableRowDataCell}>
                                <div className={css.chronoTableRowSublabel}>
                                    {subLabel.time}
                                </div>
                            </DataCell>
                            {!hideTracks && (
                                <DataCell
                                    className={css.chronoTableRowDataCell}
                                >
                                    <div className={css.chronoTableRowSublabel}>
                                        {data.quay?.publicCode || '-'}
                                    </div>
                                </DataCell>
                            )}
                            {!hideSituations && (
                                <DataCell
                                    className={css.chronoTableRowDataCell}
                                >
                                    <div className={css.chronoTableRowSublabel}>
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
            <div className={css.chronoTableRowSublabelCancellation}>
                <ValidationError />
            </div>
        )
    return null
}

export { ChronoTableRows }
