import { FilterChip } from '@entur/chip'
import { Fieldset } from '@entur/form'
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
}: IProps): JSX.Element => (
    <Fieldset className="toggle-detail-panel">
        <div className="toggle-detail-panel__container">
            {uniqueLines &&
                uniqueLines.map(({ id, publicCode, transportMode }) => (
                    <div className="toggle-detail-panel__buttons" key={id}>
                        <FilterChip
                            value={id}
                            onChange={() => toggleLiveDataLineIds(id)}
                            checked={!hiddenLines.includes(id)}
                            className="live"
                        >
                            {publicCode}
                            {getIcon(transportMode)}
                        </FilterChip>
                    </div>
                ))}
        </div>
    </Fieldset>
)

// onChange={() => {
//                     if (settings?.hiddenLiveDataLineRefs?.includes(line)) {
//                         setSettings({
//                             hiddenLiveDataLineRefs:
//                                 settings.hiddenLiveDataLineRefs.filter(
//                                     (el) => el !== line,
//                                 ),
//                         })
//                     } else if (
//                         settings?.hiddenLiveDataLineRefs &&
//                         !settings.hiddenLiveDataLineRefs.includes(line)
//                     ) {
//                         setSettings({
//                             hiddenLiveDataLineRefs: [
//                                 ...settings.hiddenLiveDataLineRefs,
//                                 line,
//                             ],
//                         })
//                     }
//                 }}

export default LiveDataPanel
