import {
    ValidationErrorFilledIcon,
    ValidationExclamationCircleFilledIcon,
} from '@entur/icons'
import { TSituationFragment } from 'graphql/index'

function getSituationText(situation: TSituationFragment) {
    const situationSummary =
        situation?.summary.find((summary) => summary.language === 'no')
            ?.value ??
        situation?.summary[0]?.value ??
        null

    const situationDescription =
        situation?.description.find((desc) => desc.language === 'no')?.value ??
        situation?.description[0]?.value ??
        null

    if (!situationSummary) return situationDescription
    else {
        if (situationSummary.length <= 25) {
            return situationSummary + ': ' + situationDescription
        }
        return situationSummary
    }
}

function Situations({
    situation,
    cancelledDeparture,
    currentSituationNumber,
    numberOfSituations,
}: {
    situation?: TSituationFragment
    cancelledDeparture: boolean
    currentSituationNumber?: number
    numberOfSituations?: number
}) {
    if (!situation) {
        return null
    }

    const situationText = getSituationText(situation)

    return (
        situationText && (
            <div className="ml-em-0.25 flex w-full flex-row items-center pt-4 md:pt-6 lg:pt-8">
                <div
                    className={`flex shrink-0 items-center justify-center text-${cancelledDeparture ? 'error' : 'warning'}`}
                >
                    {cancelledDeparture ? (
                        <ValidationErrorFilledIcon size="1em" />
                    ) : (
                        <ValidationExclamationCircleFilledIcon size="1em" />
                    )}
                </div>
                <div className="grow self-center">
                    <p
                        className={`ml-em-0.75 line-clamp-2 overflow-hidden overflow-ellipsis break-words pt-1 text-em-sm/em-base font-normal text-${cancelledDeparture ? 'error' : 'warning'}`}
                    >
                        {situationText}
                    </p>
                </div>
                <div
                    className={`ml-8 shrink-0 justify-center self-center text-center text-em-sm/em-base font-semibold text-${cancelledDeparture ? 'error' : 'warning'}`}
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

export { Situations }
