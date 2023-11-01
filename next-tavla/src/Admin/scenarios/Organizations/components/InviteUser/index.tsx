import { Button } from '@entur/button'
import { TextField } from '@entur/form'
import { AddIcon } from '@entur/icons'
import { useToggle } from 'hooks/useToggle'
import { SyntheticEvent } from 'react'
import { TOrganizationID } from 'types/settings'
import classes from './styles.module.css'
import { FeedbackCode, useFormFeedback } from 'hooks/useFormFeedback'

function InviteUser({ oid }: { oid: TOrganizationID }) {
    const [isLoading, enableLoading, disableLoading] = useToggle()
    const { setFeedback, clearFeedback, getTextFieldProps } = useFormFeedback()

    const inviteUser = (email: string) =>
        fetch('/api/organization/invite', {
            method: 'POST',
            body: JSON.stringify({ oid, email }),
        })

    const submitHandler = (event: SyntheticEvent) => {
        event.preventDefault()
        clearFeedback()

        const { email } = event.currentTarget as unknown as {
            email: HTMLInputElement
        }

        enableLoading()

        inviteUser(email.value)
            .then((response) => {
                disableLoading()
                response.json().then((data: { feedbackCode: FeedbackCode }) => {
                    setFeedback(data.feedbackCode)
                })
            })
            .catch(() => {
                disableLoading()
                setFeedback('error')
            })
    }

    return (
        <form className="flexRow g-1" onSubmit={submitHandler}>
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
