import React from 'react'
import { Fieldset } from '@entur/form'
import { FilterChip } from '@entur/chip'
import { Label } from '@entur/typography'
import './styles.scss'

import { useSettingsContext } from '../../../../settings'

function ToggleDetailsPanel(): JSX.Element {
    const [settings, settingsSetters] = useSettingsContext()
    const { hideSituations } = settings || {}
    const { setHideSituations } = settingsSetters
    return (
        <Fieldset className="toggleDetail-panel">
            <div>
                <FilterChip
                    className="filterChipComp"
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
            <Label>
                Obs! Noen av detaljene kan ikke vises i alle visningstyper.
            </Label>
        </Fieldset>
    )
}

export default ToggleDetailsPanel
