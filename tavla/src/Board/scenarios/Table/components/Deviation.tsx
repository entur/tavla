import {
    ValidationErrorFilledIcon,
    ValidationExclamationCircleFilledIcon,
} from '@entur/icons'
import { filterIdenticalSituations } from 'Board/scenarios/Board/utils'
import { TSituationFragment } from 'graphql/index'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { DeparturesContext } from '../contexts'
import { TableColumn } from './TableColumn'
import { TableRow } from './TableRow'

function Deviation({
    currentVisibleSituationId,
    situations,
}: {
    currentVisibleSituationId?: string
    situations?: TSituationFragment[]
}) {
    const departures = useNonNullContext(DeparturesContext)

    const deviations = departures.map((departure) => ({
        situations:
            filterIdenticalSituations(situations, departure.situations) ?? [],
        key: `${departure.serviceJourney.id}_${departure.aimedDepartureTime}`,
        cancelled: departure.cancellation,
        isVisible: departure.situations.some(
            (situation) => situation.id === currentVisibleSituationId,
        ),
    }))

    return (
        <TableColumn>
            {deviations.map((deviation) =>
                deviation.cancelled ? (
                    <TableRow key={deviation.key}>
                        <div
                            className={`flex w-8 items-center justify-center text-error ${deviation.isVisible ? 'bg-pink-500' : ''}`}
                        >
                            <ValidationErrorFilledIcon size={15} />
                        </div>
                    </TableRow>
                ) : (
                    <TableRow key={deviation.key}>
                        <div
                            className={`flex w-8 items-center justify-center text-warning ${deviation.isVisible ? 'bg-pink-500' : ''}`}
                        >
                            {deviation.situations.length > 0 ? (
                                <ValidationExclamationCircleFilledIcon
                                    size={15}
                                />
                            ) : (
                                <div />
                            )}
                        </div>
                    </TableRow>
                ),
            )}
        </TableColumn>
    )
}

export { Deviation }
