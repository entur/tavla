'use client'
import { Heading3 } from '@entur/typography'
import { SubmitButton } from 'components/Form/SubmitButton'
import { TFontSize } from 'types/meta'
import { saveFont as saveFontAction } from './actions'
import { TBoardID } from 'types/settings'
import { useToast } from '@entur/alert'
import { FontChoiceChip } from './FontChoiceChip'
import { useActionState } from 'react'
import { getFormFeedbackForField, TFormFeedback } from 'app/(admin)/utils'
import { FormError } from 'app/(admin)/components/FormError'

function FontSelect({ bid, font }: { bid: TBoardID; font: TFontSize }) {
    const { addToast } = useToast()

    const saveFont = async (
        state: TFormFeedback | undefined,
        data: FormData,
    ) => {
        const formFeedback = await saveFontAction(bid, data)
        if (!formFeedback) {
            addToast('Tekststørrelse lagret!')
        }
        return formFeedback
    }

    const [fontState, setFontFormAction] = useActionState(saveFont, undefined)

    return (
        <form
            action={setFontFormAction}
            className="box flex flex-col justify-between"
        >
            <Heading3 margin="bottom">Tekststørrelse </Heading3>
            <FontChoiceChip font={font} />
            <div className="mt-4">
                <FormError {...getFormFeedbackForField('general', fontState)} />
            </div>
            <div className="flex flex-row mt-8 justify-end">
                <SubmitButton variant="secondary" className="max-sm:w-full">
                    Lagre tekststørrelse
                </SubmitButton>
            </div>
        </form>
    )
}

export { FontSelect }
