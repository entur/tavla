import React from 'react'
import { Fieldset } from '@entur/form'
import { FilterChip } from '@entur/chip'
import { Label } from '@entur/typography'
import './styles.scss'

import { useSettingsContext } from '../../../../settings'

function ToggleDetailsPanel(): JSX.Element {
    const [settings, settingsSetters] = useSettingsContext()
    const { hideSituations, hideTracks, hideWalkInfo } = settings || {}
    const { setHideSituations, setHideTracks, setHideWalkInfo } =
        settingsSetters
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
                            setHideSituations(!event.currentTarget.checked)
                        }}
                        checked={!hideSituations}
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
                            setHideWalkInfo(!event.currentTarget.checked)
                        }}
                        checked={!hideWalkInfo}
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
                            setHideTracks(!event.currentTarget.checked)
                        }}
                        checked={!hideTracks}
                    >
                        Spor/plattform
                    </FilterChip>
                </div>
            </div>
        </Fieldset>
    )
}

export default ToggleDetailsPanel
