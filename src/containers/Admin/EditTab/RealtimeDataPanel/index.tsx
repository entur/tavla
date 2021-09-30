import { FilterChip } from '@entur/chip'
import { Fieldset } from '@entur/form'
import { Loader } from '@entur/loader'
import { Paragraph } from '@entur/typography'
import React from 'react'

import { Line } from '../../../../types'
import { getIcon } from '../../../../utils'

import './styles.scss'

interface IProps {
    uniqueLines: Line[] | undefined
    toggleRealtimeDataLineIds: (lineId: string) => void
    hiddenLines: string[]
}

const RealtimeDataPanel = ({
    uniqueLines,
    toggleRealtimeDataLineIds,
    hiddenLines,
}: IProps): JSX.Element =>
    !uniqueLines ? (
        <Loader>Laster...</Loader>
    ) : (
        <Fieldset className="toggle-detail-panel realtime">
            <div className="toggle-detail-panel__container">
                {uniqueLines.length > 0 ? (
                    uniqueLines.map(({ id, publicCode, transportMode }) => (
                        <div className="toggle-detail-panel__buttons" key={id}>
                            <FilterChip
                                value={id}
                                onChange={() => toggleRealtimeDataLineIds(id)}
                                checked={!hiddenLines.includes(id)}
                            >
                                {publicCode}
                                {getIcon(transportMode)}
                            </FilterChip>
                        </div>
                    ))
                ) : (
                    <Paragraph>
                        Ingen sanntidsdata å vise for stasjoenene og modusene
                        som er valgt.
                    </Paragraph>
                )}
            </div>
        </Fieldset>
    )

export default RealtimeDataPanel
