import { Button } from '@entur/button'
import { TextField } from '@entur/form'
import { useFirebaseAuthError } from 'Admin/scenarios/Login/hooks/useFirebaseAuthError'
import { useDebouncedFetch } from 'hooks/useDebouncedFetch'
import { useToggle } from 'hooks/useToggle'
import { useState } from 'react'
import { TUserID } from 'types/settings'

function InviteUser() {
    const [userId, setUserId] = useState<TUserID>()
    const [isLoading, enableLoading, disableLoading] = useToggle()

    const { getTextFieldPropsForType } = useFirebaseAuthError()

    const fetchUserByEmail = useDebouncedFetch(500, (email: string) =>
        fetch(`/api/user/getUserIdByEmail?email=${email}`),
    )

    const handleEmailInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const email = event.target.value
        enableLoading()
        fetchUserByEmail(email).then((response) => {
            disableLoading()
            if (response.status === 200) {
                response.json().then((data) => {
                    setUserId(data.uid)
                })
            } else {
                setUserId(undefined)
            }
        })
    }

    const userNotFound = !(userId || isLoading)

    return (
        <div className="flexRow g-1">
            <TextField
                name="email"
                label="E-post"
                type="email"
                onChange={handleEmailInputChange}
                {...getTextFieldPropsForType('email')}
            />
            <Button
                variant="primary"
                loading={isLoading}
                disabled={userNotFound}
            >
                {!userNotFound ? 'Send invitasjon' : 'Ukjent e-post'}
            </Button>
        </div>
    )
}

export { InviteUser }
