import React, { ChangeEvent, useCallback } from 'react'
import { useSettings } from 'settings/SettingsProvider'
import { Fieldset } from '@entur/form'
import { FilterChip } from '@entur/chip'
import { Label } from '@entur/typography'
import classes from './WeatherPanel.module.scss'

type weatherSetting = {
    name: string
    value: string
    checked: boolean
}

function WeatherPanel(): JSX.Element {
    const [settings, setSettings] = useSettings()

    const weatherSettings: weatherSetting[] = [
        {
            name: 'Værikon',
            value: 'showIcon',
            checked: settings.showIcon,
        },
        {
            name: 'Temperatur',
            value: 'showTemperature',
            checked: settings.showTemperature,
        },
        {
            name: 'Vind',
            value: 'showWind',
            checked: settings.showWind,
        },
        {
            name: 'Nedbør',
            value: 'showPrecipitation',
            checked: settings.showPrecipitation,
        },
    ]

    const onToggle = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const weatherSetting = event.target.value
            switch (weatherSetting) {
                case 'showIcon':
                    setSettings({ showIcon: !settings.showIcon })
                    break
                case 'showTemperature':
                    setSettings({ showTemperature: !settings.showTemperature })
                    break
                case 'showWind':
                    setSettings({ showWind: !settings.showWind })
                    break
                case 'showPrecipitation':
                    setSettings({
                        showPrecipitation: !settings.showPrecipitation,
                    })
                    break
            }
        },
        [
            setSettings,
            settings.showIcon,
            settings.showTemperature,
            settings.showWind,
            settings.showPrecipitation,
        ],
    )

    return (
        <Fieldset>
            <legend>Velg værinformasjon</legend>
            <Label>Se været i området for den neste timen.</Label>
            {weatherSettings.map((object) => (
                <FilterChip
                    key={object.value}
                    value={object.value}
                    checked={object.checked}
                    onChange={onToggle}
                    className={classes.FilterChip}
                >
                    {object.name}
                </FilterChip>
            ))}
        </Fieldset>
    )
}

export { WeatherPanel }
