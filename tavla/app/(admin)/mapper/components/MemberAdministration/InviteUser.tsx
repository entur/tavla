'use client'
import { TFolderID } from 'types/settings'
import { HiddenInput } from 'components/Form/HiddenInput'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { FormError } from 'app/(admin)/components/FormError'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useActionState, useRef } from 'react'
import { inviteUserAction } from './actions'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import { Heading3 } from '@entur/typography'
import { AddIcon } from '@entur/icons'
import { useToast } from '@entur/alert'

function InviteUser({ oid }: { oid?: TFolderID }) {
    const [state, formAction] = useActionState(inviteUserAction, undefined)
    const { addToast } = useToast()

    const formRef = useRef<HTMLFormElement>(null)

    const action = async (data: FormData) => {
        formAction(data)
        formRef.current?.reset()
        addToast('Medlem lagt til i mappen')
    }
    return (
        <form action={action} ref={formRef}>
            <Heading3 className="pb-2">Legg til medlem i mappen</Heading3>
            <div className="flex flex-col gap-2 sm:flex-row">
                <HiddenInput id="oid" value={oid} />
                <div className="flex w-full flex-col">
                    <ClientOnlyTextField
                        name="email"
                        id="email"
                        label="E-post"
                        type="email"
                        {...getFormFeedbackForField('email', state)}
                    />
                </div>
                <SubmitButton
                    aria-label="Legg til medlem"
                    variant="primary"
                    width="fluid"
                    className="mb-4 w-full sm:max-w-48"
                >
                    <AddIcon />
                    Legg til
                </SubmitButton>
            </div>
            <FormError {...getFormFeedbackForField('general', state)} />
        </form>
    )
}

export { InviteUser }
