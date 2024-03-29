import React, { useCallback, useEffect } from 'react'
import { useSettings } from 'settings/SettingsProvider'
import { AdminTile } from 'components/AdminTile'
import { SubParagraph } from '@entur/typography'
import { ValidationInfoIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import classes from './WeatherTile.module.scss'
import { WeatherPanel } from './components/WeatherPanel'

function WeatherTile() {
    const [settings, setSettings] = useSettings()

    useEffect(() => {
        if (
            settings.showWeather &&
            !settings.showIcon &&
            !settings.showTemperature &&
            !settings.showWind &&
            !settings.showPrecipitation
        )
            setSettings({ showWeather: false })
    }, [
        settings.showIcon,
        settings.showTemperature,
        settings.showWind,
        settings.showPrecipitation,
        settings.showWeather,
        setSettings,
    ])

    const handleWeatherSettingsChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>): void => {
            !(
                settings.showIcon ||
                settings.showTemperature ||
                settings.showWind ||
                settings.showPrecipitation
            ) && !settings.showWeather
                ? setSettings({
                      showWeather: event.currentTarget.checked,
                      showIcon: true,
                      showTemperature: true,
                      showWind: true,
                      showPrecipitation: true,
                  })
                : setSettings({
                      showWeather: event.currentTarget.checked,
                  })
        },
        [
            setSettings,
            settings.showIcon,
            settings.showTemperature,
            settings.showPrecipitation,
            settings.showWeather,
            settings.showWind,
        ],
    )

    return (
        <AdminTile
            title={
                <>
                    Vær
                    <Tooltip
                        popperModifiers={[
                            {
                                name: 'preventOverflow',
                            },
                        ]}
                        content={
                            <SubParagraph className={classes.TooltipParagraph}>
                                Tilgjengelig i visningstyper kompakt,
                                kronologisk og kart. Værdata fra YR (met.no).
                                Noe værdata kan bli skjult ved liten
                                boksstørrelse.
                            </SubParagraph>
                        }
                        placement="top"
                    >
                        <span className={classes.Icon}>
                            <ValidationInfoIcon size={20} />
                        </span>
                    </Tooltip>
                </>
            }
            onChange={handleWeatherSettingsChange}
            checked={settings.showWeather}
        >
            <WeatherPanel />
        </AdminTile>
    )
}

export { WeatherTile }
