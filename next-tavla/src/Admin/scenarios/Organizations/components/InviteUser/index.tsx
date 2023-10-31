import { Button } from '@entur/button'
import { TextField } from '@entur/form'
import { AddIcon } from '@entur/icons'
import { useToggle } from 'hooks/useToggle'
import { SyntheticEvent } from 'react'
import { TOrganization } from 'types/settings'
import classes from './styles.module.css'
import { useFormFeedback } from 'hooks/useFormFeedback'
import { concat } from 'lodash'

function InviteUser({ organization }: { organization: TOrganization }) {
    const [isLoading, enableLoading, disableLoading] = useToggle()
    const { setFeedback, clearFeedback, getTextFieldProps } = useFormFeedback()

    const fetchUserByEmail = (email: string) =>
        fetch(`/api/user/getUserIdByEmail?email=${email}`)

    const submitHandler = (event: SyntheticEvent) => {
        event.preventDefault()
        clearFeedback()

        const { email } = event.currentTarget as unknown as {
            email: HTMLInputElement
        }

        enableLoading()

        fetchUserByEmail(email.value).then((response) => {
            disableLoading()
            if (response.status === 200) {
                response.json().then((data) => {
                    if (
                        concat(
                            organization?.owners,
                            organization?.editors,
                        ).includes(data.uid)
                    ) {
                        setFeedback('invite/already-invited')
                        return
                    }
                    setFeedback('invite/success')
                })
            } else {
                setFeedback('invite/user-not-found')
            }
        })
    }

    return (
        <div className="flexColumn g-1">
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
        </div>
    )
}

export { InviteUser }
