import React, { useCallback } from 'react'
import { LegMode, TransportSubmode } from '@entur/sdk'

import { toggleValueInList } from '../../../utils'

import ModePanelRow from './ModePanelRow'

import './styles.scss'

function ModePanel({
    transportModes,
    onModesChange,
    disabledModes,
}: Props): JSX.Element {
    const onModeToggled = useCallback(
        (mode: LegMode): void => {
            onModesChange(toggleValueInList(disabledModes, mode))
        },
        [disabledModes, onModesChange],
    )

    return (
        <div className="mode-panel">
            <h2>Transportmidler</h2>
            <div>
                {transportModes.map(({ mode, subMode }, index) => (
                    <ModePanelRow
                        key={index}
                        mode={mode}
                        subMode={subMode}
                        value={!disabledModes.includes(mode)}
                        onChange={onModeToggled}
                    />
                ))}
            </div>
        </div>
    )
}

interface Props {
    transportModes: Array<{ mode: LegMode; subMode?: TransportSubmode }>
    disabledModes: Array<LegMode>
    onModesChange: (disabledModes: Array<LegMode>) => void
}

export default ModePanel
