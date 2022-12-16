import React, { useCallback } from 'react'
import { Fieldset } from '@entur/form'
import { FilterChip } from '@entur/chip'
import { Label } from '@entur/typography'
import { useSettings } from '../../../../../settings/SettingsProvider'
import classes from './ToggleDetailsPanel.module.scss'

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
        <Fieldset className={classes.ToggleDetailsPanel}>
            <div className={classes.Container}>
                <Label>
                    Obs! Noen av detaljene kan ikke vises i alle visningstyper.
                </Label>
                <br />
                <div className={classes.Buttons}>
                    <FilterChip
                        className={classes.FilterChip}
                        value="avviksinfo"
                        onChange={handleToggleHideSituations}
                        checked={!settings.hideSituations}
                    >
                        Avviksinfo
                    </FilterChip>
                </div>
                <div className={classes.Buttons}>
                    <FilterChip
                        className={classes.FilterChip}
                        value="gangavstand"
                        onChange={handleToggleHideWalkInfo}
                        checked={!settings.hideWalkInfo}
                    >
                        Gangavstand
                    </FilterChip>
                </div>
                <div className={classes.Buttons}>
                    <FilterChip
                        className={classes.FilterChip}
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
