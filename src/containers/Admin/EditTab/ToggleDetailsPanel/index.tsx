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
            <div className="toggle-detail-panel__chips">
                <FilterChip
                    className="toggle-detail-panel__filter-chip"
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
                <FilterChip
                    className="toggle-detail-panel__filter-chip"
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
                <FilterChip
                    className="toggle-detail-panel__filter-chip"
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
            <Label className="filter-label">
                Obs! Noen av detaljene kan ikke vises i alle visningstyper.
            </Label>
        </Fieldset>
    )
}

export default ToggleDetailsPanel
