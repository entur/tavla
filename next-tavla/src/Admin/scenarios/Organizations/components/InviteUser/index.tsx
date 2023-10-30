import { Button } from '@entur/button'
import { TextField } from '@entur/form'
import { useDebouncedFetch } from 'hooks/useDebouncedFetch'
import { useToggle } from 'hooks/useToggle'
import { useState } from 'react'
import { TUserID } from 'types/settings'
import { validEmail } from 'utils/regex'

function InviteUser() {
    const [userId, setUserId] = useState<TUserID>()

    const [isInvalidEmail, enableInvalidEmail, disableInvalidEmail] =
        useToggle()
    const [isLoading, enableLoading, disableLoading] = useToggle()

    const fetchUserByEmail = useDebouncedFetch(500, (email: string) =>
        fetch(`/api/user/getUserIdByEmail?email=${email}`),
    )

    const handleEmailInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const email = event.target.value

        if (!validEmail(email)) {
            enableInvalidEmail()
            return
        }
        disableInvalidEmail()
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

    const userNotFound = !isInvalidEmail && !isLoading && !userId

    return (
        <div className="flexColumn g-1">
            <div className="flexRow g-1">
                <TextField
                    name="email"
                    label="E-post"
                    type="email"
                    onChange={handleEmailInputChange}
                />
                <Button
                    variant="primary"
                    loading={isLoading}
                    disabled={!userId}
                >
                    Send invitasjon
                </Button>
            </div>
            <ul>
                {isInvalidEmail && <li>Ugyldig E-post adresse</li>}
                {userNotFound && <li>Fant ikke bruker</li>}
            </ul>
        </div>
    )
}

export { InviteUser }
