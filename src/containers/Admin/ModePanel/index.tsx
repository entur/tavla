import React, { useCallback } from 'react'
import { LegMode } from '@entur/sdk'

import { toggleValueInList } from '../../../utils'

import ModePanelRow from './ModePanelRow'

import './styles.scss'

function ModePanel({
    transportModes, onModesChange, disabledModes,
}: Props): JSX.Element {
    const onModeToggled = useCallback((mode: LegMode): void => {
        onModesChange(toggleValueInList(disabledModes, mode))
    }, [disabledModes, onModesChange])

    return (
        <div className="mode-panel">
            <h2>Transportmidler</h2>
            <div>
                { transportModes.map((mode, index) => (
                    <ModePanelRow
                        key={index}
                        mode={mode}
                        value={!disabledModes.includes(mode)}
                        onChange={onModeToggled}
                    />
                ))}
            </div>
        </div>
    )
}

interface Props {
    transportModes: Array<LegMode>,
    disabledModes: Array<LegMode>,
    onModesChange: (disabledModes: Array<LegMode>) => void,
}

export default ModePanel
