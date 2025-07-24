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
            <div className="flex h-16 w-full flex-row pt-4">
                <div
                    className={`mr-6 flex shrink-0 items-center justify-center text-${cancelledDeparture ? 'error' : 'warning'}`}
                >
                    {cancelledDeparture ? (
                        <ValidationErrorFilledIcon size="1em" />
                    ) : (
                        <ValidationExclamationCircleFilledIcon size="1em" />
                    )}
                </div>
                <div className="grow self-center">
                    <p
                        className={`line-clamp-2 overflow-hidden overflow-ellipsis break-words pt-1 text-em-sm/em-base font-normal text-${cancelledDeparture ? 'error' : 'warning'}`}
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
