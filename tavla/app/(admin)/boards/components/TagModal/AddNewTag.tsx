import { Heading3 } from '@entur/typography'
import { HiddenInput } from 'components/Form/HiddenInput'
import { TBoard } from 'types/settings'
import { FormError } from 'app/(admin)/components/FormError'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { useActionState, useRef } from 'react'
import { SubmitButton } from 'components/Form/SubmitButton'
import { addTag } from './actions'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'

function AddNewTag({ board }: { board: TBoard }) {
    const [state, action] = useActionState(addTag, undefined)
    const form = useRef<HTMLFormElement>(null)

    const submit = async (data: FormData) => {
        action(data)
        form.current?.reset()
    }
    return (
        <div className="flexCol gap-1">
            <Heading3>Legg til ny merkelapp</Heading3>
            <form ref={form} action={submit} className="flex flex-col gap-4">
                <div className="flex flex-row gap-1 w-full">
                    <ClientOnlyTextField
                        aria-label="Navn på ny merkelapp"
                        name="tag"
                        label="Merkelapp"
                    />
                    <HiddenInput id="bid" value={board.id} />
                    <SubmitButton variant="primary">Legg til</SubmitButton>
                </div>
                <FormError {...getFormFeedbackForField('general', state)} />
            </form>
        </div>
    )
}

export { AddNewTag }
