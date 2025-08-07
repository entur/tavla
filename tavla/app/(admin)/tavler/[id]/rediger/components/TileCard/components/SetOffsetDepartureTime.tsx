import { Checkbox } from '@entur/form'
import { Heading4, SubParagraph } from '@entur/typography'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import { TileContext } from 'Board/scenarios/Table/contexts'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { useEffect, useState } from 'react'
import { TLocation } from 'types/meta'

function SetOffsetDepartureTime({ address }: { address?: TLocation }) {
    const tile = useNonNullContext(TileContext)

    const walkingDistanceInMinutes = Math.ceil(
        (tile.walkingDistance?.distance ?? 0) / 60,
    )
    const [offsetBasedOnWalkingDistance, setOffsetBasedOnWalkingDistance] =
        useState(walkingDistanceInMinutes === tile.offset)

    const [offset, setOffset] = useState<number | string>(tile.offset ?? '')

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
                    clearable
                    onClear={() => {
                        setOffset('')
                    }}
                    value={offset}
                    onChange={(e) => {
                        setOffset(e.target.valueAsNumber || '')
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
