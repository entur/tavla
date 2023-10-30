import { Button } from '@entur/button'
import { TextField } from '@entur/form'
import { BulletBadge } from '@entur/layout'
import { useDebouncedFetch } from 'hooks/useDebouncedFetch'
import { useToggle } from 'hooks/useToggle'
import { useState } from 'react'
import { TOrganization, TUserID } from 'types/settings'
import { validEmail } from 'utils/regex'

function InviteUser({ organization }: { organization: TOrganization }) {
    const [userId, setUserId] = useState<TUserID>()

    const [error, setError] = useState<
        'alreadyInvited' | 'invalidEmail' | 'notFound' | null
    >(null)

    const [isLoading, enableLoading, disableLoading] = useToggle()

    const fetchUserByEmail = useDebouncedFetch(1000, (email: string) =>
        fetch(`/api/user/getUserIdByEmail?email=${email}`),
    )

    const handleEmailInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setUserId(undefined)
        setError(null)

        const email = event.target.value

        if (!validEmail(email)) {
            setError('invalidEmail')
            return
        }

        enableLoading()
        fetchUserByEmail(email).then((response) => {
            disableLoading()
            if (response.status === 200) {
                response.json().then((data) => {
                    if (
                        organization?.owners &&
                        organization?.owners.includes(data.uid)
                    ) {
                        setError('alreadyInvited')
                        return
                    }
                    setUserId(data.uid)
                })
            } else {
                setError('notFound')
            }
        })
    }

    let errorText = null

    switch (error) {
        case 'invalidEmail':
            errorText = 'Ugyldig E-post adresse'
            break
        case 'notFound':
            errorText = 'Fant ikke bruker'
            break
        case 'alreadyInvited':
            errorText = 'Brukeren er allerede invitert'
            break
    }

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
            {error && <BulletBadge variant="danger">{errorText}</BulletBadge>}
        </div>
    )
}

export { InviteUser }
