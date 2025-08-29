import {
    ValidationErrorFilledIcon,
    ValidationExclamationCircleFilledIcon,
} from '@entur/icons'
import { filterOutStopPlaceSituations } from 'Board/scenarios/Board/utils'
import { TSituationFragment } from 'graphql/index'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { DeparturesContext } from '../contexts'
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
            filterOutStopPlaceSituations(
                stopPlaceSituations,
                departure.situations,
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
    switch (deviation.type) {
        case 'cancellation':
            return (
                <ValidationErrorFilledIcon
                    color="var(--error-color)"
                    className="text-error"
                    opacity={deviation.isHighlighted ? 1 : 0.5}
                />
            )
        case 'situation':
            return (
                <ValidationExclamationCircleFilledIcon
                    color="var(--warning-color)"
                    className="text-warning"
                    opacity={deviation.isHighlighted ? 1 : 0.5}
                />
            )
        case 'no-deviation':
            return null
    }
}

export { Deviation }
