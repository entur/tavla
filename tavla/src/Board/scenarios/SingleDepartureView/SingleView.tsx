import { TravelTag } from 'components/TravelTag'
import { TQuay, TStopPlace } from 'types/graphql-schema'
import { getAirPublicCode } from 'utils/publicCode'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { Situation } from '../Table/components/Situation'
import { FormattedTime } from '../Table/components/Time/components/FormattedTime'

function SingleView({ data }: { data: TQuay | TStopPlace }) {
    const departure = data.estimatedCalls[0]
    const journey = departure?.serviceJourney

    const destinationText =
        (departure?.destinationDisplay?.via
            ?.filter(isNotNullOrUndefined)
            .join(', ') ?? '')
            ? `${departure?.destinationDisplay?.frontText} via ${departure?.destinationDisplay?.via}`
            : departure?.destinationDisplay?.frontText

    return (
        <div className="flex flex-row gap-10 justify-between text-white align-center">
            <div className="flex flex-col gap-6">
                <div className="flex gap-2 justify-start items-center pr-2">
                    <TravelTag
                        transportMode={journey?.transportMode ?? 'unknown'}
                        transportSubmode={
                            journey?.transportSubmode ?? undefined
                        }
                        publicCode={
                            (journey?.transportMode === 'air'
                                ? getAirPublicCode(journey?.id ?? '')
                                : (journey?.line.publicCode ?? '')) ?? ''
                        }
                    />
                </div>
                <p className="text-9xl text-ellipsis">{destinationText}</p>

                <Situation situation={departure?.situations[0]}></Situation>
            </div>
            <FormattedTime time={departure?.expectedDepartureTime ?? ''} />
        </div>
    )
}

export { SingleView }
