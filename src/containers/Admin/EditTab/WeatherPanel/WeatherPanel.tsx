import React, { useCallback } from 'react'

import { Fieldset } from '@entur/form'
import { FilterChip } from '@entur/chip'
import { Label } from '@entur/typography'

import { useSettingsContext } from '../../../../settings'

import './WeatherPanel.scss'

interface weatherSetting {
    name: string
    value: string
    checked: boolean
}

function WeatherPanel(): JSX.Element {
    const [settings, setSettings] = useSettingsContext()

    const {
        showIcon = true,
        showTemperature = true,
        showWind = true,
        showPrecipitation = true,
    } = settings || {}

    const weatherSettings: weatherSetting[] = [
        {
            name: 'Værikon',
            value: 'showIcon',
            checked: showIcon,
        },
        {
            name: 'Temperatur',
            value: 'showTemperature',
            checked: showTemperature,
        },
        {
            name: 'Vind',
            value: 'showWind',
            checked: showWind,
        },
        {
            name: 'Nedbør',
            value: 'showPrecipitation',
            checked: showPrecipitation,
        },
    ]

    const onToggle = useCallback(
        (event) => {
            const weatherSetting = event.target.value
            switch (weatherSetting) {
                case 'showIcon':
                    setSettings({ showIcon: !showIcon })
                    break
                case 'showTemperature':
                    setSettings({ showTemperature: !showTemperature })
                    break
                case 'showWind':
                    setSettings({ showWind: !showWind })
                    break
                case 'showPrecipitation':
                    setSettings({ showPrecipitation: !showPrecipitation })
                    break
            }
        },
        [setSettings, showIcon, showTemperature, showWind, showPrecipitation],
    )

    return (
        <Fieldset className="weather-panel">
            <div className="weather-panel__container">
                <Label>Se været i området for den neste timen.</Label>
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
