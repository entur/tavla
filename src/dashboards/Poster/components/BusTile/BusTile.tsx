import React, { useMemo } from 'react'
import { compareAsc } from 'date-fns'
import classNames from 'classnames'
import { BusIcon } from '@entur/icons'
import { useSettings } from '../../../../settings/SettingsProvider'
import { useBusTileQuery } from '../../../../../graphql-generated/journey-planner-v3'
import { useAllStopPlaceIds } from '../../../../logic/use-all-stop-place-ids/useAllStopPlaceIds'
import { REFRESH_INTERVAL } from '../../../../constants'
import { toDeparture } from '../../../../logic/use-stop-place-with-estimated-calls/departure'
import { isNotNullOrUndefined } from '../../../../utils/typeguards'
import { toStopPlaceWithEstimatedCalls } from '../../../../logic/use-stop-place-with-estimated-calls/types'
import './BusTile.scss'

function BusTile(): JSX.Element {
    const { allStopPlaceIds, loading: allStopPLaceIdsLoding } =
        useAllStopPlaceIds()
    const { data } = useBusTileQuery({
        fetchPolicy: 'cache-and-network',
        pollInterval: REFRESH_INTERVAL,
        skip: allStopPLaceIdsLoding,
        variables: {
            ids: allStopPlaceIds,
        },
    })

    const [settings] = useSettings()
    const onlyBusShowing =
        settings.hiddenModes.includes('sparkesykkel') &&
        settings.hiddenModes.includes('delebil') &&
        settings.hiddenModes.includes('bysykkel')

    const numberOfLines = onlyBusShowing ? 6 : 3

    const busDepartures = useMemo(
        () =>
            data?.stopPlaces
                ?.map(toStopPlaceWithEstimatedCalls)
                .filter(isNotNullOrUndefined)
                .flatMap((stopPlace) =>
                    stopPlace?.estimatedCalls
                        .filter(isNotNullOrUndefined)
                        .map(toDeparture),
                )
                .sort((a, b) => compareAsc(a.departureTime, b.departureTime))
                .slice(0, numberOfLines) ?? [],
        [data?.stopPlaces, numberOfLines],
    )

    const rowClass = classNames('poster-bus-tile-row', {
        'poster-bus-tile-row--only-bus': onlyBusShowing,
    })

    const routeClass = classNames('poster-bus-tile-route', {
        'poster-bus-tile-route--only-bus': onlyBusShowing,
    })

    return (
        <>
            <div className="poster-next-bus">Neste buss</div>
            <div className="poster-bus-tile">
                {busDepartures.map((departure) => {
                    const routeNumber = departure.route.split(' ')[0]
                    const routeDestination = departure.route
                        .split(' ')
                        .slice(1)
                        .join(' ')

                    return (
                        <div key={departure.id} className={rowClass}>
                            <div className={routeClass}>
                                <BusIcon className="poster-bus-tile-icon" />
                                <span>{routeNumber}</span>
                            </div>
                            <p className="poster-bus-tile-destination">
                                {routeDestination}
                            </p>
                            <p className="poster-bus-tile-time">
                                {departure.time}
                            </p>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export { BusTile }
