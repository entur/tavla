import { transportModeNames } from 'app/(admin)/tavler/[id]/rediger/components/TileCard/utils'
import { TSituationFragment } from 'graphql/index'
import { TTransportMode } from 'types/graphql-schema'
import { DeviationIcon } from './DeviationIcon'

const SITUATION_SUMMARY_LENGTH_THRESHOLD = 25

function getSituationText(situation: TSituationFragment) {
    const norwegianSummary = situation?.summary.find(
        (summary) => summary.language === 'no',
    )?.value
    const summary = norwegianSummary ?? situation?.summary[0]?.value

    const norwegianDescription = situation?.description.find(
        (description) => description.language === 'no',
    )?.value

    const description = norwegianDescription ?? situation?.description[0]?.value

    if (description === undefined) {
        return summary
    } else if (summary === undefined) {
        return description
    } else if (summary.length <= SITUATION_SUMMARY_LENGTH_THRESHOLD) {
        return summary + ' - ' + description
    } else {
        return summary
    }
}

function getTransportModeAndPublicCodeText(
    transportModeList?: TTransportMode[],
    publicCodeList?: string[],
): string | null {
    if (transportModeList && publicCodeList) {
        const transportMode =
            transportModeList.length === 1
                ? transportModeNames(transportModeList[0])
                : 'Linje'
        const publicCodes =
            publicCodeList.length === 1
                ? publicCodeList[0]
                : publicCodeList.join(', ')

        return `${transportMode} ${publicCodes}`
    } else {
        return null
    }
}

function TileSituations({
    situation,
    cancelledDeparture,
    currentSituationNumber,
    numberOfSituations,
    publicCodeList,
    transportModeList,
}: {
    situation?: TSituationFragment
    cancelledDeparture: boolean
    currentSituationNumber?: number
    numberOfSituations?: number
    transportModeList?: TTransportMode[]
    publicCodeList?: string[]
}) {
    if (!situation) {
        return null
    }

    const situationText = getSituationText(situation)
    const transportModeWithPublicCode = getTransportModeAndPublicCodeText(
        transportModeList,
        publicCodeList,
    )

    const textColor = cancelledDeparture ? 'error' : 'warning'

    return (
        situationText && (
            <div className="ml-em-0.25 flex w-full shrink-0 flex-row items-center pt-3">
                <div
                    className={`flex shrink-0 items-center justify-center text-${textColor}`}
                >
                    <DeviationIcon
                        deviationType={
                            cancelledDeparture ? 'cancellation' : 'situation'
                        }
                    />
                </div>
                <div className="grow self-center">
                    <p
                        className={`ml-em-0.75 break-words text-em-lg/em-lg ${cancelledDeparture ? 'text-error' : 'text-warning'}`}
                    >
                        <>
                            {transportModeWithPublicCode && (
                                <b>
                                    {transportModeWithPublicCode}
                                    <>: </>
                                </b>
                            )}
                            {situationText}
                        </>
                    </p>
                </div>
                <div
                    className={`ml-8 shrink-0 justify-center text-center text-em-lg/em-lg font-semibold text-${textColor}`}
                >
                    {currentSituationNumber !== undefined &&
                        numberOfSituations !== undefined &&
                        numberOfSituations > 1 && (
                            <>
                                {currentSituationNumber + 1} /{' '}
                                {numberOfSituations}
                            </>
                        )}
                </div>
            </div>
        )
    )
}

export { TileSituations }
