import { useEffect, useState } from 'react'
import { useSettings } from 'settings/SettingsProvider'
import { REFRESH_INTERVAL } from '../constants'

async function getWeather(
    latitude: number,
    longitude: number,
): Promise<Properties> {
    const url = `https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${latitude}&lon=${longitude}`
    const weather = await fetch(url).then((response) => {
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        return response.json()
    })

    return {
        meta: weather.properties.meta,
        timeseries: weather.properties.timeseries,
    }
}

function useWeather(): Properties | undefined {
    const [settings] = useSettings()
    const [weather, setWeather] = useState<Properties | undefined>()

    useEffect(() => {
        getWeather(
            settings.coordinates.latitude,
            settings.coordinates.longitude,
        ).then(setWeather)

        const intervalId = setInterval(() => {
            getWeather(
                settings.coordinates?.latitude ?? 0,
                settings.coordinates?.longitude ?? 0,
            )
                .then((res) => res)
                .then(setWeather)
        }, REFRESH_INTERVAL)
        return (): void => clearInterval(intervalId)
    }, [settings.coordinates])
    return weather
}

type Properties = {
    meta: MetaDetails
    timeseries: TimeseriesPoint[]
}

type MetaDetails = {
    units: {
        air_pressure_at_sea_level: string
        air_temperature: string
        air_temperature_max: string
        air_temperature_min: string
        cloud_area_fraction: string
        cloud_area_fraction_high: string
        cloud_area_fraction_low: string
        cloud_area_fraction_medium: string
        dew_point_temperature: string
        fog_area_fraction: string
        precipitation_amount: string
        precipitation_amount_max: string
        precipitation_amount_min: string
        probability_of_precipitation: string
        probability_of_thunder: string
        relative_humidity: string
        ultraviolet_index_clear_sky: string
        wind_from_direction: string
        wind_speed: string
        wind_speed_of_gust: string
    }
}

type TimeseriesPoint = {
    time: Date
    data: {
        instant: {
            details: WeatherDetailsInstant
        }
        next_1_hours: {
            summary: {
                symbol_code: string
            }
            details: WeatherDetailsFuture
        }
        next_6_hours: {
            summary: {
                symbol_code: string
            }
            details: WeatherDetailsFuture
        }
        next_12_hours: {
            summary: {
                symbol_code: string
            }
            details: {
                probability_of_precipitation: number
            }
        }
    }
}

type WeatherDetailsInstant = {
    air_pressure_at_sea_level: number
    air_temperature: number
    cloud_area_fraction: number
    relative_humidity: number
    wind_from_direction: number
    wind_speed: number
    cloud_area_fraction_high: number
    cloud_area_fraction_low: number
    cloud_area_fraction_medium: number
    dew_point_temperature: number
    fog_area_fraction: number
    ultraviolet_index_clear_sky: number
    wind_speed_of_gust: number
}

type WeatherDetailsFuture = {
    air_temperature_max: number
    air_temperature_min: number
    precipitation_amount: number
    precipitation_amount_max: number
    precipitation_amount_min: number
    probability_of_precipitation: number
}
export { useWeather }
