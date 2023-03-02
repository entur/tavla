import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LoginCase } from 'scenarios/Modals/LoginModal/login-modal-types'
import { LoginModal } from 'scenarios/Modals/LoginModal'
import { signOut } from 'firebase/auth'
import { auth } from 'settings/firebase-init'
import { useSettings } from 'settings/SettingsProvider'
import { useUser } from 'settings/UserProvider'
import sikkerhetBomLight from 'assets/images/sikkerhet_bom_light@2x.png'
import { useToast } from '@entur/alert'
import { ErrorWrapper } from './components/ErrorWrapper'

function LockedTavle() {
    const [settings] = useSettings()
    const user = useUser()
    const userLoggedin = Boolean(user && !user.isAnonymous)
    const navigate = useNavigate()
    const { documentId } = useParams<{ documentId: string }>()
    const { addToast } = useToast()

    const [displayLogin, setDisplayLogin] = useState<boolean>(false)
    const callback = !userLoggedin
        ? (event: React.SyntheticEvent<HTMLButtonElement>): void => {
              event.preventDefault()
              setDisplayLogin(true)
          }
        : (event: React.SyntheticEvent<HTMLButtonElement>): void => {
              event.preventDefault()
              addToast({
                  title: 'Logget ut',
                  content: 'Du er nå logget ut av din konto.',
                  variant: 'success',
              })

              signOut(auth).then(() => navigate(`/t/${documentId}`))
          }
    const callbackMessage = !userLoggedin ? 'Logg inn' : 'Logg ut'

    const loginModal = !userLoggedin ? (
        <LoginModal
            open={displayLogin}
            onDismiss={(): void => setDisplayLogin(false)}
            loginCase={LoginCase.error}
        />
    ) : null

    const errorMessage = !userLoggedin
        ? 'Tavla du forsøker å redigere er låst til en konto. Om det er din tavle, må du først logge inn for å redigere den.'
        : 'Tavla du forsøker å redigere er låst til en annen konto. Om det er din tavle, må du logge inn på denne kontoen for å redigere den.'

    return (
        <div>
            {loginModal}
            <ErrorWrapper
                title="Oi! Denne tavla er låst."
                message={errorMessage}
                image={sikkerhetBomLight}
                callbackMessage={callbackMessage}
                callback={callback}
                theme={settings.theme}
            />
        </div>
    )
}

export { LockedTavle }
