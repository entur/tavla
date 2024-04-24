'use client'
import { TextField } from '@entur/form'
import { AddIcon } from '@entur/icons'
import { TOrganizationID } from 'types/settings'
import classes from './styles.module.css'
import { useFormState } from 'react-dom'
import { HiddenInput } from 'components/Form/HiddenInput'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { FormError } from 'app/(admin)/components/FormError'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useRef } from 'react'
import { inviteUser } from './actions'

function InviteUser({ oid }: { oid?: TOrganizationID }) {
    const [state, formAction] = useFormState(inviteUser, undefined)

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
                    <TextField
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
                    className={`${classes.addMemberButton} flex flex-row items-center justify-center`}
                >
                    Legg til medlem
                    <AddIcon className="!top-0" />
                </SubmitButton>
            </div>
            <FormError {...getFormFeedbackForField('general', state)} />
        </form>
    )
}

export { InviteUser }
