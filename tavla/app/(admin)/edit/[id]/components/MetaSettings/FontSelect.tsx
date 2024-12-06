'use client'
import { Heading3 } from '@entur/typography'
import { SubmitButton } from 'components/Form/SubmitButton'
import { TFontSize } from 'types/meta'
import { saveFont as saveFontAction } from './actions'
import { TBoardID } from 'types/settings'
import { useToast } from '@entur/alert'
import { FontChoiceChip } from './FontChoiceChip'

function FontSelect({ bid, font }: { bid: TBoardID; font: TFontSize }) {
    const { addToast } = useToast()

    const saveFont = async (data: FormData) => {
        const formFeedback = await saveFontAction(bid, data)
        if (!formFeedback) {
            addToast('Tekststørrelse lagret!')
        }
    }

    return (
        <form action={saveFont} className="box flex flex-col justify-between">
            <Heading3 margin="bottom">Tekststørrelse </Heading3>
            <FontChoiceChip font={font}></FontChoiceChip>
            <div className="flex flex-row mt-8 justify-end">
                <SubmitButton variant="secondary" className="max-sm:w-full">
                    Lagre tekststørrelse
                </SubmitButton>
            </div>
        </form>
    )
}

export { FontSelect }
