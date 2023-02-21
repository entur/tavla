import { useMemo } from 'react'
import { ApolloError } from '@apollo/client'
import {
    FormFactor,
    useRentalStationsQuery,
} from 'graphql-generated/mobility-v2'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { REFRESH_INTERVAL } from 'utils/constants'
import { useStationIds } from '../use-station-ids/useStationIds'
import { toRentalStation, RentalStation } from './types'

interface UseRentalStations {
    rentalStations: RentalStation[]
    loading: boolean
    error: ApolloError | undefined
}

function useRentalStations(
    formFactors?: FormFactor[],
    filterHidden: boolean | undefined = true,
): UseRentalStations {
    const {
        stationIds,
        loading: allStationIdsLoading,
        error: allStationIdsError,
    } = useStationIds({ formFactors, filterHidden })

    const { data, loading, error } = useRentalStationsQuery({
        skip: allStationIdsLoading,
        fetchPolicy: 'cache-and-network',
        pollInterval: REFRESH_INTERVAL,
        variables: {
            ids: stationIds,
        },
    })

    const rentalStations = useMemo(
        () =>
            data?.stationsById
                ?.map(toRentalStation)
                .filter(isNotNullOrUndefined) ?? [],
        [data?.stationsById],
    )

    return {
        rentalStations,
        loading: loading || allStationIdsLoading,
        error: error || allStationIdsError,
    }
}

export { useRentalStations }
