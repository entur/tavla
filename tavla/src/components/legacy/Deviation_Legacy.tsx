import { removeStopPlaceSituations } from 'Board/scenarios/Board/utils'
import { DeparturesContext } from 'Board/scenarios/Table/contexts'
import { TSituationFragment } from 'graphql/index'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { DeviationIcon_Legacy } from './DeviationIcon_Legacy'

type Situation = {
    type: 'situation'
    situations: TSituationFragment[]
    isHighlighted: boolean
}

type Cancellation = {
    type: 'cancellation'
    isHighlighted: boolean
}

type NoDeviation = { type: 'no-deviation' }

type Deviation = Situation | Cancellation | NoDeviation

function Deviation_Legacy({
    currentVisibleSituationId,
    stopPlaceSituations,
    numberOfShownSituations,
}: {
    currentVisibleSituationId?: string
    stopPlaceSituations?: TSituationFragment[]
    numberOfShownSituations?: number
}) {
    const departures = useNonNullContext(DeparturesContext)

    const deviations: Deviation[] = departures.map((departure) => {
        const isHighlighted =
            numberOfShownSituations && numberOfShownSituations > 0
                ? departure.situations.some(
                      (s) => s.id === currentVisibleSituationId,
                  )
                : true

        const filteredSituations =
            removeStopPlaceSituations(
                departure.situations,
                stopPlaceSituations,
            ) ?? []

        if (departure.cancellation) {
            return { type: 'cancellation', isHighlighted }
        }

        if (filteredSituations.length > 0) {
            return {
                type: 'situation',
                situations: filteredSituations,
                isHighlighted,
            }
        }

        return { type: 'no-deviation' }
    })

    return (
        <div className="flex w-[1.5em] flex-col gap-2">
            {deviations.map((deviation, index) => {
                if (deviation.type === 'no-deviation') {
                    return <div key={index} className="h-[1.5em] w-[1.5em]" />
                }

                return (
                    <div
                        key={index}
                        className="flex h-[1.5em] w-[1.5em] items-center justify-center"
                    >
                        <DeviationIcon_Legacy
                            deviationType={deviation.type}
                            isHighlighted={deviation.isHighlighted}
                        />
                    </div>
                )
            })}
        </div>
    )
}

export { Deviation_Legacy }
