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
            {deviations.map((deviation) =>
                deviation.cancelled ? (
                    <TableCell key={deviation.key}>
                        <div
                            className={`flex w-7 items-center justify-center text-error ${deviation.isVisible ? '' : 'opacity-50'}`}
                        >
                            <ValidationErrorFilledIcon size="0.75em" />
                        </div>
                    </TableCell>
                ) : (
                    <TableCell key={deviation.key}>
                        <div
                            className={`flex w-7 items-center justify-center text-warning ${deviation.isVisible ? '' : 'opacity-50'}`}
                        >
                            {deviation.situations.length > 0 ? (
                                <ValidationExclamationCircleFilledIcon size="0.75em" />
                            ) : (
                                <div />
                            )}
                        </div>
                    </TableCell>
                ),
            )}
        </TableColumn>
    )
}

export { Deviation }
