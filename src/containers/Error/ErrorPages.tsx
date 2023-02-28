import React, { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { LoginModal } from 'components/AccountModals/LoginModal/LoginModal'
import { LoginCase } from 'components/AccountModals/LoginModal/login-modal-types'
import { auth, useUser } from 'settings/UserProvider'
import { useSettings } from 'settings/SettingsProvider'
import sikkerhetBomLight from 'assets/images/sikkerhet_bom_light@2x.png'
import duerLight from 'assets/images/duer@2x.png'
import sauerLight from 'assets/images/sauer_lag@2x.png'
import { useToast } from '@entur/alert'
import { Navbar } from '../Navbar/Navbar'
import { ErrorWrapper } from './ErrorWrapper'

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

function NoStopsOnTavle(): JSX.Element {
    const [settings] = useSettings()

    return (
        <div>
            <ErrorWrapper
                title="Nå havnet vi på ville veier."
                message="Vi finner ingen stoppesteder å vise på denne tavla. Rediger tavla eller prøv et nytt søk."
                image={sauerLight}
                altText="Illustrasjon av flere sauer som står på en toglinje"
                theme={settings.theme}
            />
        </div>
    )
}

function NoTavlerAvailable(): JSX.Element {
    const navigate = useNavigate()
    const callback = useCallback(
        (event: React.SyntheticEvent<HTMLButtonElement>): void => {
            event.preventDefault()
            navigate(`/`)
        },
        [navigate],
    )
    return (
        <div>
            <ErrorWrapper
                title="Her var det tomt!"
                message="Du har ingen tavler som er lagret på denne kontoen. Trykk på knappen nedenfor for å lage en avgangstavle."
                image={duerLight}
                callbackMessage="Lag en ny tavle"
                callback={callback}
                altText=""
            />
        </div>
    )
}

function NoSharedTavlerAvailable(): JSX.Element {
    return (
        <div>
            <ErrorWrapper
                title="Her var det tomt!"
                message="Du har ingen tavleforespørsler for øyeblikket. Andre kan dele sine tavler med deg under «Deling»-fanen på innstillingene til tavla."
                image={duerLight}
                altText=""
            />
        </div>
    )
}

function NoAccessToTavler(): JSX.Element {
    const [displayLogin, setDisplayLogin] = useState<boolean>(false)
    const callback = useCallback(
        (event: React.SyntheticEvent<HTMLButtonElement>): void => {
            event.preventDefault()
            setDisplayLogin(true)
        },
        [],
    )
    const loginModal = (
        <LoginModal
            open={displayLogin}
            onDismiss={(): void => setDisplayLogin(false)}
            loginCase={LoginCase.error}
        />
    )

    return (
        <div>
            {loginModal}
            <Navbar />
            <ErrorWrapper
                title="Dine tavler venter!"
                message="Du må logge inn for å se oversikten over tavlene dine. Trykk på knappen nedenfor for å logge inn."
                image={sikkerhetBomLight}
                altText="Illustrasjon av en bom som er lukket, slik at du ikke kan passere"
                callbackMessage="Logg inn"
                callback={callback}
            />
        </div>
    )
}

export {
    LockedTavle,
    NoTavlerAvailable,
    NoStopsOnTavle,
    NoSharedTavlerAvailable,
    NoAccessToTavler,
}
