'use client'
import { TOrganizationID } from 'types/settings'
import { HiddenInput } from 'components/Form/HiddenInput'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { FormError } from 'app/(admin)/components/FormError'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useActionState, useRef } from 'react'
import { inviteUserAction } from './actions'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import { SubParagraph } from '@entur/typography'

function InviteUser({ oid }: { oid?: TOrganizationID }) {
    const [state, formAction] = useActionState(inviteUserAction, undefined)

    const formRef = useRef<HTMLFormElement>(null)

    const action = async (data: FormData) => {
        formAction(data)
        formRef.current?.reset()
    }
    return (
        <form action={action} ref={formRef}>
            <SubParagraph>Legg til medlem</SubParagraph>
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
                    variant="secondary"
                    width="fluid"
                    className="mb-4 w-full sm:max-w-48"
                >
                    Legg til medlem
                </SubmitButton>
            </div>
            <FormError {...getFormFeedbackForField('general', state)} />
        </form>
    )
}

export { InviteUser }
