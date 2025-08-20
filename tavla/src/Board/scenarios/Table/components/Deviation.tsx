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

    const deviations = departures.map((departure) => ({
        situations:
            filterSituationsFromChosenStop(situations, departure.situations) ??
            [],
        key: `${departure.serviceJourney.id}_${departure.aimedDepartureTime}`,
        cancelled: departure.cancellation,
        isVisible:
            numberOfShownSituations && numberOfShownSituations > 0
                ? departure.situations.some(
                      (situation) => situation.id === currentVisibleSituationId,
                  )
                : true,
    }))

    return (
        <TableColumn>
            {deviations.map((deviation) => {
                const show = deviation.cancelled
                    ? 'cancelled'
                    : deviation.situations.length > 0
                      ? 'situation'
                      : null

                let icon = null
                let deviationType = ''

                if (show === 'cancelled') {
                    icon = <ValidationErrorFilledIcon />
                    deviationType = 'text-error'
                } else if (show === 'situation') {
                    icon = <ValidationExclamationCircleFilledIcon />
                    deviationType = 'text-warning'
                }

                return (
                    <TableCell key={deviation.key}>
                        {icon && (
                            <div
                                className={`flex ${deviationType} ${deviation.isVisible ? '' : 'opacity-50'}`}
                            >
                                {icon}
                            </div>
                        )}
                    </TableCell>
                )
            })}
        </TableColumn>
    )
}

export { Deviation }
