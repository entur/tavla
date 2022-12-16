import React, { useCallback } from 'react'
import { Fieldset } from '@entur/form'
import { FilterChip } from '@entur/chip'
import { Label } from '@entur/typography'
import { useSettings } from '../../../../../settings/SettingsProvider'
import './ToggleDetailsPanel.scss'

function ToggleDetailsPanel(): JSX.Element {
    const [settings, setSettings] = useSettings()

    const handleToggleHideSituations = useCallback(() => {
        setSettings({
            hideSituations: !settings.hideSituations,
        })
    }, [settings, setSettings])

    const handleToggleHideWalkInfo = useCallback(() => {
        setSettings({
            hideWalkInfo: !settings.hideWalkInfo,
        })
    }, [settings, setSettings])

    const handleToggleHideTracks = useCallback(() => {
        setSettings({
            hideTracks: !settings.hideTracks,
        })
    }, [settings, setSettings])

    return (
        <Fieldset className="toggle-detail-panel">
            <div className="toggle-detail-panel__container">
                <Label>
                    Obs! Noen av detaljene kan ikke vises i alle visningstyper.
                </Label>
                <br />
                <div className="toggle-detail-panel__buttons">
                    <FilterChip
                        value="avviksinfo"
                        onChange={handleToggleHideSituations}
                        checked={!settings.hideSituations}
                    >
                        Avviksinfo
                    </FilterChip>
                </div>
                <div className="toggle-detail-panel__buttons">
                    <FilterChip
                        value="gangavstand"
                        onChange={handleToggleHideWalkInfo}
                        checked={!settings.hideWalkInfo}
                    >
                        Gangavstand
                    </FilterChip>
                </div>
                <div className="toggle-detail-panel__buttons">
                    <FilterChip
                        value="sporinfo"
                        onChange={handleToggleHideTracks}
                        checked={!settings.hideTracks}
                    >
                        Plattform
                    </FilterChip>
                </div>
            </div>
        </Fieldset>
    )
}

export { ToggleDetailsPanel }
