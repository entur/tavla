import { useMemo } from 'react'
import { ApolloError } from '@apollo/client'
import {
    FormFactor,
    useRentalStationsQuery,
} from '../../../graphql-generated/mobility-v2'
import { isNotNullOrUndefined } from '../../utils/typeguards'
import { useAllStationIds } from '../use-all-station-ids/useAllStationIds'
import { REFRESH_INTERVAL } from '../../constants'
import { isRentalStation, RentalStation } from './types'

interface UseRentalStations {
    rentalStations: RentalStation[]
    loading: boolean
    error: ApolloError | undefined
}

function useRentalStations(formFactor?: FormFactor[]): UseRentalStations {
    const {
        allStationIds,
        loading: allStationIdsLoading,
        error: allStationIdsError,
    } = useAllStationIds(formFactor)

    const { data, loading, error } = useRentalStationsQuery({
        skip: allStationIdsLoading,
        fetchPolicy: 'cache-and-network',
        pollInterval: REFRESH_INTERVAL,
        variables: {
            ids: allStationIds,
        },
    })

    const rentalStations = useMemo(
        () =>
            data?.stationsById
                ?.map(isRentalStation)
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
