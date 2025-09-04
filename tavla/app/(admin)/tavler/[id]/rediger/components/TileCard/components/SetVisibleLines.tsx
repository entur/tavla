import { ValidationErrorFilledIcon } from '@entur/icons'
import { Heading4 } from '@entur/typography'
import { getFormFeedbackForField, TFormFeedback } from 'app/(admin)/utils'
import { HiddenInput } from 'components/Form/HiddenInput'
import { TTransportMode } from 'types/graphql-schema'
import { TransportModeAndLines } from '../TransportModeAndLines'
import { TLineFragment } from '../types'
import { sortLineByPublicCode } from '../utils'

function SetVisibleLines({
    state,
    uniqLines,
    transportModes,
}: {
    state?: TFormFeedback
    uniqLines: TLineFragment[]
    transportModes: (TTransportMode | null)[]
}) {
    const linesByModeSorted = transportModes
        .map((transportMode) => ({
            transportMode,
            lines: uniqLines
                .filter((line) => line.transportMode === transportMode)
                .sort(sortLineByPublicCode),
        }))
        .sort((a, b) => b.lines.length - a.lines.length)

    const formFeedback = getFormFeedbackForField('general', state)?.feedback
    return (
        <>
            <Heading4>Transportmidler og linjer</Heading4>
            {formFeedback && (
                <div className="flex flex-row gap-2">
                    <div className="flex items-center text-error">
                        <ValidationErrorFilledIcon />
                    </div>
                    <div className="text-xs">{formFeedback}</div>
                </div>
            )}
            <div className="flex flex-col gap-4 md:flex-row">
                {linesByModeSorted.map(({ transportMode, lines }) => (
                    <TransportModeAndLines
                        key={transportMode}
                        transportMode={transportMode}
                        lines={lines}
                    />
                ))}
            </div>
            <HiddenInput id="count" value={uniqLines.length.toString()} />
        </>
    )
}

export { SetVisibleLines }
