import React, { useEffect } from 'react'
import { useSettings } from 'settings/SettingsProvider'
import { SubParagraph } from '@entur/typography'
import { ValidationInfoIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { EditTile } from '../EditTile/EditTile'
import { WeatherPanel } from './WeatherPanel/WeatherPanel'
import classes from './WeatherTile.module.scss'

const WeatherTile: React.FC = () => {
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

    const handleWeatherSettingsChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ): void => {
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
    }

    return (
        <EditTile
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
        </EditTile>
    )
}

export { WeatherTile }
