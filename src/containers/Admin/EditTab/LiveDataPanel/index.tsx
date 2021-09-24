import { FilterChip } from '@entur/chip'
import { Fieldset } from '@entur/form'
import React from 'react'

import { StopPlaceWithLines } from '../../../../types'

interface IProps {
    stopPlacesWitLines: StopPlaceWithLines[]
}

const LiveDataPanel = ({ stopPlacesWitLines }: IProps): JSX.Element => (
    <Fieldset className="toggle-detail-panel">
        {stopPlacesWitLines.map((stop) =>
            stop.lines.map((line) => (
                <div className="toggle-detail-panel__buttons" key={line.name}>
                    <FilterChip value={line.name}>{line.name}</FilterChip>
                </div>
            )),
        )}
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
