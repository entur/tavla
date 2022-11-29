import React from 'react'
import { StopPlaceMarker } from '../StopPlaceMarker/StopPlaceMarker'
import { useStopPlaceIds } from '../../../logic/use-stop-place-ids/useStopPlaceIds'

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
