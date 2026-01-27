import { Checkbox } from '@entur/form'
import { Heading4, SubParagraph } from '@entur/typography'
import { TileContext } from 'app/(admin)/tavler/[id]/rediger/components/TileCard/context'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useEffect, useRef, useState } from 'react'
import { useNonNullContext } from 'src/hooks/useNonNullContext'
import { LocationDB } from 'src/types/db-types/boards'

function SetOffsetDepartureTime({
    address,
    trackingLocation,
    board_id,
}: {
    address?: LocationDB
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    board_id: string
}) {
    const posthog = usePosthogTracking()
    const tile = useNonNullContext(TileContext)

    const walkingDistanceInMinutes = Math.ceil(
        (tile.walkingDistance?.distance ?? 0) / 60,
    )
    const [offsetBasedOnWalkingDistance, setOffsetBasedOnWalkingDistance] =
        useState(walkingDistanceInMinutes === tile.offset)

    const [offset, setOffset] = useState<number | string>(tile.offset ?? '')
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (!address) {
            setOffsetBasedOnWalkingDistance(false)
        }
    }, [address])

    return (
        <>
            <Heading4>Forskyv avgangstid</Heading4>
            <div className="flex flex-col gap-2">
                <SubParagraph>
                    Vis kun avganger som går om mer enn et valgt antall
                    minutter.
                </SubParagraph>
                <ClientOnlyTextField
                    label="Antall minutter"
                    name="offset"
                    id="offset"
                    type="number"
                    min={0}
                    className="!w-full md:!w-1/2 lg:!w-1/4"
                    clearable={!offsetBasedOnWalkingDistance}
                    onClear={() => {
                        setOffset('')
                    }}
                    value={offset}
                    onChange={(e) => {
                        setOffset(e.target.valueAsNumber || '')

                        if (debounceTimerRef.current) {
                            clearTimeout(debounceTimerRef.current)
                        }

                        debounceTimerRef.current = setTimeout(() => {
                            posthog.capture('stop_place_edit_interaction', {
                                location: trackingLocation,
                                board_id: board_id,
                                field: 'offset',
                                action: 'changed',
                                column_value: 'none',
                            })
                        }, 500)
                    }}
                    readOnly={offsetBasedOnWalkingDistance}
                />
                {address && !Number.isNaN(tile.walkingDistance?.distance) && (
                    <Checkbox
                        checked={offsetBasedOnWalkingDistance}
                        onChange={() => {
                            if (!offsetBasedOnWalkingDistance)
                                setOffset(walkingDistanceInMinutes)
                            else setOffset(tile.offset ?? '')

                            setOffsetBasedOnWalkingDistance(
                                !offsetBasedOnWalkingDistance,
                            )

                            posthog.capture('stop_place_edit_interaction', {
                                location: trackingLocation,
                                board_id: board_id,
                                field: 'offset_walking_dist',
                                action: !offsetBasedOnWalkingDistance
                                    ? 'toggled_on'
                                    : 'toggled_off',
                                column_value: 'none',
                            })
                        }}
                    >
                        Forskyv basert på gangavstand
                    </Checkbox>
                )}
            </div>
        </>
    )
}

export { SetOffsetDepartureTime }
