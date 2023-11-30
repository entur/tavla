'use client'
import { TextField } from '@entur/form'
import { AddIcon } from '@entur/icons'
import { TOrganizationID } from 'types/settings'
import classes from './styles.module.css'
import { inviteUserAction } from 'Admin/utils/formActions'
import { useFormState } from 'react-dom'
import { HiddenInput } from 'components/Form/HiddenInput'
import { getFormStateProps } from 'utils/formStatuses'
import { SubmitButton } from 'components/Form/SubmitButton'

function InviteUser({ oid }: { oid?: TOrganizationID }) {
    const [formState, formAction] = useFormState(inviteUserAction, undefined)

    return (
        <form className={classes.inviteForm} action={formAction}>
            <HiddenInput id="oid" value={oid} />
            <div className="flexColumn g-1 w-100">
                <TextField
                    name="email"
                    label="E-post"
                    type="email"
                    {...getFormStateProps(formState)}
                />
            </div>
            <SubmitButton
                variant="primary"
                width="fluid"
                className={classes.addMemberButton}
            >
                Legg til medlem
                <AddIcon />
            </SubmitButton>
        </form>
    )
}

export { InviteUser }
