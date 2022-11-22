import { useEffect } from 'react'
import { useSettings } from '../../settings/SettingsProvider'
import { REFRESH_INTERVAL } from '../../constants'
import {
    FormFactor,
    useUseRentalStations_StationsByIdLazyQuery,
    useUseRentalStations_NearbyStationsLazyQuery,
    StationFragment,
} from '../../../graphql-generated/mobility-v2'
import { isNotNullOrUndefined } from '../../utils/typeguards'

function useRentalStations(
    excludeHiddenStations = true,
    formFactor: FormFactor | undefined = undefined,
    isDisabled = false,
): StationFragment[] {
    const [settings] = useSettings()

    const [getNearbyStations, { data: getNearByStationsData }] =
        useUseRentalStations_NearbyStationsLazyQuery()

    const [getStationsById, { data: getStationsByIdData }] =
        useUseRentalStations_StationsByIdLazyQuery()

    useEffect(() => {
        if (isDisabled) return
        getNearbyStations({
            fetchPolicy: 'cache-and-network',
            variables: {
                lat: settings.coordinates.latitude,
                lon: settings.coordinates.longitude,
                range: settings.distance,
                availableFormFactors: formFactor,
            },
        }).finally()
    }, [
        settings.coordinates,
        settings.distance,
        isDisabled,
        getNearbyStations,
        formFactor,
    ])

    useEffect(() => {
        if (!getNearByStationsData || isDisabled) return
        const nearbyStationIds =
            getNearByStationsData?.stations
                ?.filter(isNotNullOrUndefined)
                .map((station) => station.id) ?? []

        const stationsToFetch = excludeHiddenStations
            ? nearbyStationIds.filter(
                  (stationId) => !settings.hiddenStations.includes(stationId),
              )
            : nearbyStationIds

        const uniqueStationsToFetch = [
            ...new Set([...stationsToFetch, ...settings.newStations]),
        ]

        getStationsById({
            fetchPolicy: 'cache-and-network',
            pollInterval: REFRESH_INTERVAL,
            variables: {
                stationIds: uniqueStationsToFetch,
            },
        }).finally()
    }, [
        settings.hiddenStations,
        settings.newStations,
        isDisabled,
        excludeHiddenStations,
        getStationsById,
        getNearByStationsData,
    ])

    return getStationsByIdData?.stationsById?.filter(isNotNullOrUndefined) ?? []
}

export { useRentalStations }
