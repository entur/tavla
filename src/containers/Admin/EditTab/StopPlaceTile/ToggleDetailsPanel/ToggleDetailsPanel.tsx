import React from 'react'
import { Fieldset } from '@entur/form'
import { FilterChip } from '@entur/chip'
import { Label } from '@entur/typography'
import { useSettings } from '../../../../../settings/SettingsProvider'
import './ToggleDetailsPanel.scss'

function ToggleDetailsPanel(): JSX.Element {
    const [settings, setSettings] = useSettings()

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
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                        ): void => {
                            setSettings({
                                hideSituations: !event.currentTarget.checked,
                            })
                        }}
                        checked={!settings.hideSituations}
                    >
                        Avviksinfo
                    </FilterChip>
                </div>
                <div className="toggle-detail-panel__buttons">
                    <FilterChip
                        value="gangavstand"
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                        ): void => {
                            setSettings({
                                hideWalkInfo: !event.currentTarget.checked,
                            })
                        }}
                        checked={!settings.hideWalkInfo}
                    >
                        Gangavstand
                    </FilterChip>
                </div>
                <div className="toggle-detail-panel__buttons">
                    <FilterChip
                        value="sporinfo"
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                        ): void => {
                            setSettings({
                                hideTracks: !event.currentTarget.checked,
                            })
                        }}
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
