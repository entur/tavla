import { useEffect } from 'react'
import { useSettings } from '../../settings/SettingsProvider'
import { REFRESH_INTERVAL } from '../../constants'
import {
    FormFactor,
    useUseRentalStations_StationsByIdLazyQuery,
    useUseRentalStations_NearbyStationsLazyQuery,
    UseRentalStations_StationFragment,
} from '../../../graphql-generated/mobility-v2'
import { isNotNullOrUndefined } from '../../utils/typeguards'

function useRentalStations(
    excludeHiddenStations = true,
    formFactor: FormFactor | undefined = undefined,
): UseRentalStations_StationFragment[] {
    const [settings] = useSettings()

    const [getNearbyStations, { data: getNearByStationsData }] =
        useUseRentalStations_NearbyStationsLazyQuery()

    const [getStationsById, { data: getStationsByIdData }] =
        useUseRentalStations_StationsByIdLazyQuery()

    const {
        coordinates,
        distance,
        newStations = [],
        hiddenStations = [],
        hiddenModes,
    } = settings || {}

    const isDisabled = Boolean(hiddenModes?.includes('bysykkel'))

    useEffect(() => {
        if (!coordinates || !distance || isDisabled) return
        getNearbyStations({
            fetchPolicy: 'cache-and-network',
            variables: {
                lat: coordinates.latitude,
                lon: coordinates.longitude,
                range: distance,
                availableFormFactors: formFactor,
            },
        }).finally()
    }, [coordinates, distance, isDisabled, getNearbyStations, formFactor])

    useEffect(() => {
        if (!getNearByStationsData || isDisabled) return
        const nearbyStationIds =
            getNearByStationsData?.stations
                ?.filter(isNotNullOrUndefined)
                .map((station) => station.id) ?? []

        const stationsToFetch = excludeHiddenStations
            ? nearbyStationIds.filter(
                  (stationId) => !hiddenStations.includes(stationId),
              )
            : nearbyStationIds

        const uniqueStationsToFetch = [
            ...new Set([...stationsToFetch, ...newStations]),
        ]

        getStationsById({
            fetchPolicy: 'cache-and-network',
            pollInterval: REFRESH_INTERVAL,
            variables: {
                stationIds: uniqueStationsToFetch,
            },
        }).finally()
    }, [
        hiddenStations,
        isDisabled,
        excludeHiddenStations,
        newStations,
        getStationsById,
        getNearByStationsData,
    ])

    return getStationsByIdData?.stationsById?.filter(isNotNullOrUndefined) ?? []
}

export { useRentalStations }
