import React, { ChangeEvent, useCallback } from 'react'
import { Fieldset } from '@entur/form'
import { FilterChip } from '@entur/chip'
import { Label } from '@entur/typography'
import { useSettings } from '../../../../../settings/SettingsProvider'
import './WeatherPanel.scss'

interface weatherSetting {
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
        <Fieldset className="weather-panel">
            <div className="legendWraper">
                <legend>Velg værinformasjon</legend>
                <div className="weather-panel__container">
                    <Label>Se været i området for den neste timen.</Label>
                </div>
                <br />
                {weatherSettings.map((object) => (
                    <div key={object.value} className="scooter-panel__buttons">
                        <FilterChip
                            value={object.value}
                            checked={object.checked}
                            onChange={onToggle}
                        >
                            <span className="weather-panel__eds-paragraph">
                                {object.name}
                            </span>
                        </FilterChip>
                    </div>
                ))}
            </div>
        </Fieldset>
    )
}

export { WeatherPanel }
