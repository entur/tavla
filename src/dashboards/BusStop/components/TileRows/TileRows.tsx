import React, { Fragment } from 'react'
import { Heading3 } from '@entur/typography'
import { DataCell, TableBody, TableRow } from '@entur/table'
import { IconColorType, LineData } from '../../../../types'
import { SituationModal } from '../../../../components/SituationModal/SituationModal'
import { createTileSubLabel, isMobileWeb } from '../../../../utils'
import { SubLabelIcon } from '../SubLabelIcon/SubLabelIcon'
import { DateRow } from '../../../../components/DateRow/DateRow'
import { getIcon } from '../../../../utils/icon'
import './TileRows.scss'

const isMobile = isMobileWeb()

function TileRows({
    visibleDepartures,
    hideSituations,
    hideTracks,
    iconColorType,
}: Props): JSX.Element {
    return (
        <TableBody>
            {visibleDepartures.map((data, index) => {
                const icon = getIcon(data.type, iconColorType, data.subType)
                const subLabel = createTileSubLabel(data)
                const previousRow = visibleDepartures[index - 1]

                return (
                    <Fragment key={data.id}>
                        <DateRow
                            currentRow={data}
                            previousRow={previousRow}
                        ></DateRow>
                        <TableRow className="tilerow">
                            <DataCell>
                                <div className="tilerow__icon">{icon}</div>
                            </DataCell>
                            <DataCell>
                                <Heading3 className="tilerow__label">
                                    {data.route}
                                </Heading3>
                            </DataCell>
                            <DataCell>
                                <div className="tilerow__sublabel">
                                    {subLabel.time}
                                </div>
                            </DataCell>
                            {!hideTracks ? (
                                <DataCell>
                                    <div className="tilerow__sublabel">
                                        {data.quay?.publicCode || '-'}
                                    </div>
                                </DataCell>
                            ) : null}
                            {!hideSituations ? (
                                <DataCell>
                                    {isMobile && data?.situation ? (
                                        <SituationModal
                                            situationMessage={data?.situation}
                                        />
                                    ) : (
                                        <SubLabelIcon
                                            subLabel={createTileSubLabel(data)}
                                        />
                                    )}
                                </DataCell>
                            ) : null}
                        </TableRow>
                    </Fragment>
                )
            })}
        </TableBody>
    )
}
interface Props {
    visibleDepartures: LineData[]
    hideSituations: boolean | undefined
    hideTracks: boolean | undefined
    iconColorType: IconColorType
}

export { TileRows }
