'use client'
import { useToast } from '@entur/alert'
import { AddIcon } from '@entur/icons'
import { Heading3 } from '@entur/typography'
import { FormError } from 'app/(admin)/components/FormError'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import { HiddenInput } from 'components/Form/HiddenInput'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useActionState, useRef } from 'react'
import { FolderId } from 'types/db-types/folders'
import { inviteUserAction } from './actions'

function InviteUser({ folderid }: { folderid?: FolderId }) {
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
                <HiddenInput id="folderid" value={folderid} />
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
