'use client'
import { TextField } from '@entur/form'
import { AddIcon } from '@entur/icons'
import { TOrganizationID } from 'types/settings'
import classes from './styles.module.css'
import { inviteUserAction } from 'Admin/utils/formActions'
import { useFormState } from 'react-dom'
import { HiddenInput } from 'components/Form/HiddenInput'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { FormError } from 'app/(admin)/components/FormError'
import { SecondaryButton } from '@entur/button'

function InviteUser({ oid }: { oid?: TOrganizationID }) {
    const [state, formAction] = useFormState(inviteUserAction, undefined)

    return (
        <form action={formAction}>
            <div className={classes.inviteForm}>
                <HiddenInput id="oid" value={oid} />
                <div className="flexColumn w-100">
                    <TextField
                        name="email"
                        id="email"
                        label="E-post"
                        type="email"
                        {...getFormFeedbackForField('email', state)}
                    />
                </div>
                <SecondaryButton
                    aria-label="Legg til medlem"
                    width="fluid"
                    className={classes.addMemberButton}
                >
                    Legg til medlem
                    <AddIcon />
                </SecondaryButton>
            </div>
            <FormError {...getFormFeedbackForField('general', state)} />
        </form>
    )
}

export { InviteUser }
