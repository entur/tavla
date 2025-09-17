import { removeStopPlaceSituations } from 'Board/scenarios/Board/utils'
import { TSituationFragment } from 'graphql/index'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { DeparturesContext } from '../contexts'
import { AvvikCircle } from './AvvikCircle'
import { TableCell } from './TableCell'
import { TableColumn } from './TableColumn'

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

function Deviation({
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
                      (situation) => situation.id === currentVisibleSituationId,
                  )
                : true

        const filteredSituations =
            removeStopPlaceSituations(
                departure.situations,
                stopPlaceSituations,
            ) ?? []

        if (departure.cancellation) {
            return {
                type: 'cancellation',
                isHighlighted,
            }
        } else if (filteredSituations.length > 0) {
            return {
                type: 'situation',
                situations: filteredSituations,
                isHighlighted,
            }
        } else {
            return { type: 'no-deviation' }
        }
    })

    return (
        <TableColumn>
            {deviations.map((deviation, index) => (
                <TableCell key={deviation.type + index}>
                    <DeviationIcon deviation={deviation} />
                </TableCell>
            ))}
        </TableColumn>
    )
}

function DeviationIcon({ deviation }: { deviation: Deviation }) {
    if (deviation.type === 'no-deviation') {
        return null
    }

    return (
        <div
            className="flex items-center justify-center"
            style={{ height: '3em' }}
        >
            <AvvikCircle
                cancelledDeparture={deviation.type === 'cancellation'}
                isHighlighted={deviation.isHighlighted}
                opacity={deviation.isHighlighted ? 1 : 0.5}
            />
        </div>
    )
}

export { Deviation }
