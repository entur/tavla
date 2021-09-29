import { FilterChip } from '@entur/chip'
import { Fieldset } from '@entur/form'
import { Loader } from '@entur/loader'
import React from 'react'

import { Line } from '../../../../types'
import { getIcon } from '../../../../utils'

import './styles.scss'

interface IProps {
    uniqueLines: Line[] | undefined
    toggleLiveDataLineIds: (lineId: string) => void
    hiddenLines: string[]
}

const LiveDataPanel = ({
    uniqueLines,
    toggleLiveDataLineIds: toggleLiveDataLineIds,
    hiddenLines,
}: IProps): JSX.Element =>
    !uniqueLines ? (
        <Loader>Laster...</Loader>
    ) : (
        <Fieldset className="toggle-detail-panel realtime">
            <div className="toggle-detail-panel__container">
                {uniqueLines &&
                    uniqueLines.map(({ id, publicCode, transportMode }) => (
                        <div className="toggle-detail-panel__buttons" key={id}>
                            <FilterChip
                                value={id}
                                onChange={() => toggleLiveDataLineIds(id)}
                                checked={!hiddenLines.includes(id)}
                            >
                                {publicCode}
                                {getIcon(transportMode)}
                            </FilterChip>
                        </div>
                    ))}
            </div>
        </Fieldset>
    )

export default LiveDataPanel
