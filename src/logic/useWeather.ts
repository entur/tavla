import { useEffect, useState } from 'react'
import { REFRESH_INTERVAL } from '../constants'
import { useSettingsContext } from '../settings'

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
    const [settings] = useSettingsContext()
    const [weather, setWeather] = useState<Properties | undefined>()

    const coordinates = settings?.coordinates
    useEffect(() => {
        if (!coordinates) return
        getWeather(coordinates.latitude, coordinates.longitude).then(setWeather)

        const intervalId = setInterval(() => {
            getWeather(coordinates?.latitude ?? 0, coordinates?.longitude ?? 0)
                .then((res) => res)
                .then(setWeather)
        }, REFRESH_INTERVAL)
        return (): void => clearInterval(intervalId)
    }, [coordinates])
    return weather
}

interface Properties {
    meta: MetaDetails
    timeseries: TimeseriesPoint[]
}

interface MetaDetails {
    units: {
        air_pressure_at_sea_level: number
        air_temperature: number
        air_temperature_max: number
        air_temperature_min: number
        cloud_area_fraction: number
        cloud_area_fraction_high: number
        cloud_area_fraction_low: number
        cloud_area_fraction_medium: number
        dew_point_temperature: number
        fog_area_fraction: number
        precipitation_amount: number
        precipitation_amount_max: number
        precipitation_amount_min: number
        probability_of_precipitation: number
        probability_of_thunder: number
        relative_humidity: number
        ultraviolet_index_clear_sky: number
        wind_from_direction: number
        wind_speed: number
        wind_speed_of_gust: number
    }
}

interface TimeseriesPoint {
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

interface WeatherDetailsInstant {
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

interface WeatherDetailsFuture {
    air_temperature_max: number
    air_temperature_min: number
    precipitation_amount: number
    precipitation_amount_max: number
    precipitation_amount_min: number
    probability_of_precipitation: number
}
export { useWeather }
