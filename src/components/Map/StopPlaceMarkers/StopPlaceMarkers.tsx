import React from 'react'
import { useStopPlaceIds } from 'hooks/use-stop-place-ids/useStopPlaceIds'
import { StopPlaceMarker } from '../StopPlaceMarker/StopPlaceMarker'

const StopPlaceMarkers = () => {
    const { stopPlaceIds } = useStopPlaceIds()

    return (
        <>
            {stopPlaceIds.map((stopPlaceId) => (
                <StopPlaceMarker stopPlaceId={stopPlaceId} key={stopPlaceId} />
            ))}
        </>
    )
}

export { StopPlaceMarkers }
