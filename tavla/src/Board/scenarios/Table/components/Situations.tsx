import {
    ValidationErrorFilledIcon,
    ValidationExclamationCircleFilledIcon,
} from '@entur/icons'
import { transportModeNames } from 'app/(admin)/tavler/[id]/rediger/components/TileCard/utils'
import { TSituationFragment } from 'graphql/index'
import { TTransportMode } from 'types/graphql-schema'

function getSituationText(
    situation: TSituationFragment,
    transportModeList?: TTransportMode[],
    publicCodeList?: string[],
) {
    const situationSummary =
        situation?.summary.find((summary) => summary.language === 'no')
            ?.value ??
        situation?.summary[0]?.value ??
        null

    const situationDescription =
        situation?.description.find((desc) => desc.language === 'no')?.value ??
        situation?.description[0]?.value ??
        null

    let situationText = undefined
    let transportMode = undefined
    let publicCodes = undefined

    if (!situationDescription) situationText = situationSummary
    else if (!situationSummary) situationText = situationDescription
    else {
        if (situationSummary.length <= 25) {
            situationText = situationSummary + ' - ' + situationDescription
        }
        situationText = situationSummary
    }

    if (transportModeList && publicCodeList) {
        if (transportModeList.length === 1) {
            transportMode = transportModeNames(transportModeList[0] ?? null)
        } else transportMode = 'Linje'

        if (publicCodeList.length === 1) {
            publicCodes = publicCodeList[0]
        } else {
            publicCodes = publicCodeList.join(', ')
        }
        return (
            <>
                <b>
                    {transportMode} {publicCodes}
                    <>: </>
                </b>
                {situationText}
            </>
        )
    }
    return situationText
}

function Situations({
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

    const situationText = getSituationText(
        situation,
        transportModeList,
        publicCodeList,
    )

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
