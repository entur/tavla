import {
    ValidationErrorFilledIcon,
    ValidationExclamationCircleFilledIcon,
} from '@entur/icons'
import { filterSituationsFromChosenStop } from 'Board/scenarios/Board/utils'
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
    situations,
    numberOfShownSituations,
}: {
    currentVisibleSituationId?: string
    situations?: TSituationFragment[]
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
            filterSituationsFromChosenStop(situations, departure.situations) ??
            []

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
                    className={deviation.isHighlighted ? '' : 'opacity-50'}
                />
            )
        case 'situation':
            return (
                <ValidationExclamationCircleFilledIcon
                    color="var(--warning-color)"
                    className={deviation.isHighlighted ? '' : 'opacity-50'}
                />
            )
        case 'no-deviation':
            return null
    }
}

export { Deviation }
