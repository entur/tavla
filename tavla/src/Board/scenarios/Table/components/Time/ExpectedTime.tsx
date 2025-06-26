import { useNonNullContext } from 'hooks/useNonNullContext'
import { formatDateString, getRelativeTimeString } from 'utils/time'
import { DeparturesContext } from 'Board/scenarios/Table/contexts'
import { TableColumn } from '../TableColumn'
import { TableRow } from '../TableRow'
import { FormattedTime } from './components/FormattedTime'
import { nanoid } from 'nanoid'

const TWO_MINUTES = 120

function ExpectedTime() {
    const departures = useNonNullContext(DeparturesContext)

    const time = departures.map((departure) => ({
        aimedDepartureTime: departure.aimedDepartureTime,
        expectedDepartureTime: departure.expectedDepartureTime,
        cancelled: departure.cancellation,
        key: nanoid(),
    }))

    return (
        <TableColumn title="Forventet" className="text-right">
            {time.map((t) => (
                <TableRow key={t.key}>
                    <Time
                        expectedDepartureTime={t.expectedDepartureTime}
                        aimedDepartureTime={t.aimedDepartureTime}
                        cancelled={t.cancelled}
                    />
                </TableRow>
            ))}
        </TableColumn>
    )
}

function Time({
    expectedDepartureTime,
    aimedDepartureTime,
    cancelled,
}: {
    expectedDepartureTime: string
    aimedDepartureTime: string
    cancelled: boolean
}) {
    if (cancelled)
        return (
            <>
                <div className="text-right text-em-sm/em-base font-semibold text-estimated-time">
                    Innstilt
                </div>
                <div className="lineThrough text-right text-em-xs/em-xs">
                    {formatDateString(aimedDepartureTime)}
                </div>
            </>
        )

    const timeDeviationInSeconds = Math.abs(
        (Date.parse(aimedDepartureTime) - Date.parse(expectedDepartureTime)) /
            1000,
    )

    if (timeDeviationInSeconds > TWO_MINUTES) {
        return (
            <>
                <div className="text-right font-semibold leading-em-base text-estimated-time">
                    {getRelativeTimeString(expectedDepartureTime)}
                </div>
                <div className="lineThrough text-right text-em-xs/em-xs">
                    {formatDateString(aimedDepartureTime)}
                </div>
            </>
        )
    }

    return <FormattedTime time={expectedDepartureTime} />
}

export { ExpectedTime }
