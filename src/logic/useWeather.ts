import { useEffect, useState } from 'react'

import { REFRESH_INTERVAL } from '../constants'

import { useSettingsContext } from '../settings'

async function getWeather(
    latitude: number | null,
    longitude: number | null,
): Promise<TimeseriesPoint[]> {
    const url = `https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${latitude}&lon=${longitude}`
    const weather = await fetch(url).then((response) => {
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        return response.json()
    })
    return weather.properties.timeseries.map((point: TimeseriesPoint) => point)
}

export default function useWeather(): TimeseriesPoint[] | null {
    const [settings] = useSettingsContext()
    const [weather, setWeather] = useState<TimeseriesPoint[] | null>(null)

    const coordinates = settings?.coordinates
    useEffect(() => {
        getWeather(
            coordinates?.latitude ?? 0,
            coordinates?.longitude ?? 0,
        ).then(setWeather)

        const intervalId = setInterval(() => {
            getWeather(coordinates?.latitude ?? 0, coordinates?.longitude ?? 0)
                .then((res) => res)
                .then(setWeather)
        }, REFRESH_INTERVAL)
        return (): void => clearInterval(intervalId)
    }, [coordinates])
    return weather
}

// See all available datapoint here (https://api.met.no/doc/ForecastJSON)
interface TimeseriesPoint {
    data: {
        instant: { details: WeatherDetails }
        next_1_hours: {
            details: {
                precipitation_amount: number
                probability_of_precipitation: number
            }
            summary: { symbol_code: string }
        }
    }
    time: Date
}

interface WeatherDetails {
    air_pressure_at_sea_level: number
    air_temperature: number
    cloud_area_fraction: number
    relative_humidity: number
    wind_from_direction: number
    wind_speed: number
}
