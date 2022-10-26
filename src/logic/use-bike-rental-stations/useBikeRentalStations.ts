import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { Station } from '@entur/sdk/lib/mobility/types'
import { useSettings } from '../../settings/SettingsProvider'
import { REFRESH_INTERVAL } from '../../constants'
import GetNearbyStations from './GetNearbyStations.mobility.graphql'
import GetStationsById from './GetStationsById.mobility.graphql'

function useBikeRentalStations(excludeHiddenStations = true): Station[] {
    const [settings] = useSettings()

    const [getNearbyStations, { data: getNearByStationsData }] = useLazyQuery<{
        stations: Station[]
    }>(GetNearbyStations)

    const [getStationsById, { data: getStationsByIdData }] = useLazyQuery<{
        stationsById: Station[]
    }>(GetStationsById)

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
            },
        }).finally()
    }, [coordinates, distance, isDisabled, getNearbyStations])

    useEffect(() => {
        if (!getNearByStationsData || isDisabled) return
        const nearbyStationIds =
            getNearByStationsData?.stations.map((station) => station.id) ?? []

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

    return getStationsByIdData?.stationsById ?? []
}

export { useBikeRentalStations }
