import React, { useCallback } from 'react'
import { LegMode, TransportSubmode } from '@entur/sdk'

import { toggleValueInList } from '../../../../utils'

import ModePanelRow from './ModePanelRow'

import './styles.scss'
import ThemeContrastWrapper from '../../../ThemeWrapper/ThemeContrastWrapper'
import { useSettingsContext } from '../../../../settings'
import { Theme } from '../../../../types'

function ModePanel({
    transportModes,
    onModesChange,
    disabledModes,
}: Props): JSX.Element {
    const [settings] = useSettingsContext()
    const onModeToggled = useCallback(
        (mode: LegMode): void => {
            onModesChange(toggleValueInList(disabledModes, mode))
        },
        [disabledModes, onModesChange],
    )

    return (
        <ThemeContrastWrapper useContrast={settings?.theme === Theme.DARK}>
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
        </ThemeContrastWrapper>
    )
}

interface Props {
    transportModes: Array<{ mode: LegMode; subMode?: TransportSubmode }>
    disabledModes: LegMode[]
    onModesChange: (disabledModes: LegMode[]) => void
}

export default ModePanel
