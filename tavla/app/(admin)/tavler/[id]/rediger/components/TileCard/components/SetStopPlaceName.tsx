import { Heading4, SubParagraph } from '@entur/typography'
import { getFormFeedbackForField, TFormFeedback } from 'app/(admin)/utils'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import { useState } from 'react'
import { TTile } from 'types/tile'

function SetStopPlaceName({
    tile,
    state,
    isCombined,
}: {
    tile: TTile
    state?: TFormFeedback
    isCombined: boolean
}) {
    const [displayName, setDisplayName] = useState(tile.displayName ?? '')

    return (
        <div className="flex flex-col gap-2">
            <Heading4 margin="bottom">Navn på stoppested</Heading4>
            <div>
                <SubParagraph margin="none">
                    Dette navnet vil vises i tavlen.
                </SubParagraph>
                <SubParagraph>
                    Det originale navnet til stoppestedet:{' '}
                    {tile.name.split(',')[0]}
                </SubParagraph>
                {isCombined && (
                    <SubParagraph className="!text-error">
                        Har du samlet stoppestedene i én liste vil du ikke ha
                        mulighet til å sette navn på stoppested.
                    </SubParagraph>
                )}
            </div>
            <ClientOnlyTextField
                label="Navn på stoppested"
                className="!w-full md:!w-1/2 lg:!w-1/4"
                name="displayName"
                value={displayName}
                readOnly={isCombined}
                maxLength={50}
                clearable={!isCombined}
                onClear={() => {
                    setDisplayName('')
                }}
                onChange={(e) => setDisplayName(e.target.value)}
                {...getFormFeedbackForField('name', state)}
            />
        </div>
    )
}

export { SetStopPlaceName }
