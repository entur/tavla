import React from 'react'
import { useAllStopPlaceIds } from '../../../logic/use-all-stop-place-ids/useAllStopPlaceIds'
import { StopPlaceMarker } from '../StopPlaceMarker/StopPlaceMarker'

const StopPlaceMarkers = () => {
    const { allStopPlaceIds } = useAllStopPlaceIds()

    return (
        <>
            {allStopPlaceIds.map((stopPlaceId) => (
                <StopPlaceMarker stopPlaceId={stopPlaceId} key={stopPlaceId} />
            ))}
        </>
    )
}

export { StopPlaceMarkers }
