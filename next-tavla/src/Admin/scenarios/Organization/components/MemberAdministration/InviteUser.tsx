'use client'
import { Button } from '@entur/button'
import { TextField } from '@entur/form'
import { AddIcon } from '@entur/icons'
import { useToggle } from 'hooks/useToggle'
import { TOrganizationID } from 'types/settings'
import classes from './styles.module.css'
import { useFormFeedback } from 'hooks/useFormFeedback'
import { inviteUserAction } from 'Admin/utils/formActions'

function InviteUser({ oid }: { oid?: TOrganizationID }) {
    const [isLoading, enableLoading, disableLoading] = useToggle()
    const { setFeedback, clearFeedback, getTextFieldProps } = useFormFeedback()

    const submitAction = async (data: FormData) => {
        enableLoading()
        clearFeedback()
        const feedback = await inviteUserAction(data, oid ?? '')
        disableLoading()
        setFeedback(feedback)
    }

    return (
        <form className={classes.inviteForm} action={submitAction}>
            <div className="flexColumn g-1 w-100">
                <TextField
                    name="email"
                    label="E-post"
                    type="email"
                    {...getTextFieldProps()}
                />
            </div>
            <Button
                variant="primary"
                loading={isLoading}
                onClick={clearFeedback}
                width="fluid"
                className={classes.addMemberButton}
            >
                Legg til medlem
                <AddIcon />
            </Button>
        </form>
    )
}

export { InviteUser }
