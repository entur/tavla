import React, { useCallback, useMemo } from 'react'
import { xor } from 'lodash'
import { getTranslation, byName } from 'utils/utils'
import { useSettings } from 'settings/SettingsProvider'
import { FormFactor } from 'graphql-generated/mobility-v2'
import { useRentalStations } from 'hooks/useRentalStations'
import { Paragraph } from '@entur/typography'
import { Checkbox, Fieldset } from '@entur/form'
import classes from './BikePanel.module.scss'

function BikePanel(): JSX.Element {
    const [settings, setSettings] = useSettings()

    const { rentalStations } = useRentalStations([FormFactor.Bicycle], false)

    const stations = useMemo(
        () => rentalStations.sort(byName),
        [rentalStations],
    )

    const onChooseAllPressed = useCallback(() => {
        if (settings.hiddenStations.length > 0) {
            setSettings({
                hiddenStations: [],
            })
        } else {
            setSettings({
                hiddenStations: stations.map(({ id }) => id),
            })
        }
    }, [settings.hiddenStations.length, setSettings, stations])

    const onToggleStation = useCallback(
        (stationId: string) => () => {
            setSettings({
                hiddenStations: xor(settings.hiddenStations, [stationId]),
            })
        },
        [settings.hiddenStations, setSettings],
    )

    if (!stations.length) {
        return (
            <Fieldset>
                <Paragraph className={classes.Paragraph}>
                    Det er ingen stasjoner i nærheten.
                </Paragraph>
            </Fieldset>
        )
    }

    return (
        <Fieldset>
            <legend className={classes.LegendWrapper}>
                Velg stasjoner i nærheten
            </legend>
            <Checkbox
                name="check-all-stop-places-bike"
                onChange={onChooseAllPressed}
                checked={!settings.hiddenStations.length}
            >
                Velg alle
            </Checkbox>
            {stations.map(({ name, id }) => (
                <Checkbox
                    key={id}
                    name={getTranslation(name) || ''}
                    checked={!settings.hiddenStations.includes(id)}
                    onChange={onToggleStation(id)}
                    className={classes.Checkbox}
                >
                    <span className={classes.Paragraph}>
                        {getTranslation(name) || ''}
                    </span>
                </Checkbox>
            ))}
        </Fieldset>
    )
}

export { BikePanel }
