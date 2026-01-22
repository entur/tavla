import { Heading4, SubParagraph } from '@entur/typography'
import { TileContext } from 'app/(admin)/tavler/[id]/rediger/components/TileCard/context'
import { getFormFeedbackForField, TFormFeedback } from 'app/(admin)/utils'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { useState } from 'react'

function SetStopPlaceName({ state }: { state?: TFormFeedback }) {
    const tile = useNonNullContext(TileContext)
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
            </div>
            <ClientOnlyTextField
                label="Navn på stoppested"
                className="!w-full md:!w-1/2 lg:!w-1/4"
                name="displayName"
                value={displayName}
                maxLength={50}
                clearable={!!displayName}
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
