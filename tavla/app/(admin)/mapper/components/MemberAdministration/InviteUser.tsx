'use client'
import { AddIcon } from '@entur/icons'
import { TOrganizationID } from 'types/settings'
import { HiddenInput } from 'components/Form/HiddenInput'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { FormError } from 'app/(admin)/components/FormError'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useActionState, useRef } from 'react'
import { inviteUserAction } from './actions'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'

function InviteUser({ oid }: { oid?: TOrganizationID }) {
    const [state, formAction] = useActionState(inviteUserAction, undefined)

    const formRef = useRef<HTMLFormElement>(null)

    const action = async (data: FormData) => {
        formAction(data)
        formRef.current?.reset()
    }
    return (
        <form action={action} ref={formRef}>
            <div className="flex flex-col sm:flex-row gap-1">
                <HiddenInput id="oid" value={oid} />
                <div className="flex flex-col w-full">
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
                    variant="secondary"
                    width="fluid"
                    className="w-full sm:max-w-48"
                >
                    Legg til medlem
                    <AddIcon />
                </SubmitButton>
            </div>
            <FormError {...getFormFeedbackForField('general', state)} />
        </form>
    )
}

export { InviteUser }
