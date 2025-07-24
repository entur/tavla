import {
    ValidationErrorFilledIcon,
    ValidationExclamationCircleFilledIcon,
} from '@entur/icons'
import { TSituationFragment } from 'graphql/index'
import { sortBy } from 'lodash'
import { useCycler } from '../useCycler'
import { Situation } from './Situation'

function Situations({ situations }: { situations: TSituationFragment[] }) {
    const index = useCycler(situations)
    const numberOfSituations = situations.length

    if (!situations.length) return null
    const sortedSituations = sortBy(situations, (s) => s.summary[0]?.value)
    return (
        <Situation situation={sortedSituations[index % numberOfSituations]} />
    )
}

function NewSituations({
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
    const situationText =
        situation?.summary.find((summary) => summary.language === 'no')
            ?.value ??
        situation?.summary[0]?.value ??
        situation?.description.find((desc) => desc.language === 'no')?.value ??
        situation?.description[0]?.value ??
        null

    return (
        <div className="flex min-h-10 w-full flex-row pt-2">
            <div
                className={`mr-2 flex w-10 items-center justify-center text-${cancelledDeparture ? 'error' : 'warning'}`}
            >
                {cancelledDeparture ? (
                    <ValidationErrorFilledIcon />
                ) : (
                    <ValidationExclamationCircleFilledIcon />
                )}
            </div>
            <div className="grow self-center">
                <p
                    className={`overflow-hidden overflow-ellipsis hyphens-auto break-words text-em-sm/em-base text-${cancelledDeparture ? 'error' : 'warning'}`}
                >
                    {situationText}
                </p>
            </div>
            <div
                className={`shrink-0 justify-center self-center px-2 text-center text-em-sm/em-base text-${cancelledDeparture ? 'error' : 'warning'}`}
            >
                {currentSituationNumber !== undefined &&
                    numberOfSituations !== undefined &&
                    numberOfSituations > 1 && (
                        <>
                            {currentSituationNumber + 1} / {numberOfSituations}
                        </>
                    )}
            </div>
        </div>
    )
}

export { NewSituations, Situations }
