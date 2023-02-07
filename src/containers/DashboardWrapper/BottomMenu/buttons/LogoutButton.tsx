import React from 'react'
import { signOut } from 'firebase/auth'
import { useUser } from 'src/UserProvider'
import { useToast } from '@entur/alert'
import { LogOutIcon } from '@entur/icons'
import { auth } from '../../../../firebase-init'
import { MenuButton } from '../MenuButton/MenuButton'

const LogoutButton = () => {
    const { addToast } = useToast()
    const user = useUser()

    if (!user || user.isAnonymous) return null

    return (
        <MenuButton
            title="Logg ut"
            icon={<LogOutIcon size={21} />}
            callback={(): void => {
                addToast({
                    title: 'Logget ut',
                    content: 'Du er nå logget ut av din konto.',
                    variant: 'success',
                })
                signOut(auth)
            }}
        />
    )
}

export { LogoutButton }
