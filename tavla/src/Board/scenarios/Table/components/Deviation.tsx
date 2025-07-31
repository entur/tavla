import {
    ValidationErrorFilledIcon,
    ValidationExclamationCircleFilledIcon,
} from '@entur/icons'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { DeparturesContext } from '../contexts'
import { TableCell } from './TableCell'
import { TableColumn } from './TableColumn'

function Deviation() {
    const departures = useNonNullContext(DeparturesContext)

    const deviations = departures.map((departure) => ({
        situations: departure.situations ?? [],
        key: `${departure.serviceJourney.id}_${departure.aimedDepartureTime}`,
        cancelled: departure.cancellation,
    }))

    return (
        <TableColumn>
            {deviations.map((deviation) =>
                deviation.cancelled ? (
                    <TableCell key={deviation.key}>
                        <div className="flex w-10 items-center justify-center text-error">
                            <ValidationErrorFilledIcon />
                        </div>
                    </TableCell>
                ) : (
                    <TableCell key={deviation.key}>
                        <div className="flex w-10 items-center justify-center text-warning">
                            {deviation.situations.length > 0 ? (
                                <ValidationExclamationCircleFilledIcon />
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
