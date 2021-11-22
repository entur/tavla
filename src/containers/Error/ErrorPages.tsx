import React, { useState } from 'react'

import { useHistory } from 'react-router'

import { signOut } from 'firebase/auth'

import { useToast } from '@entur/alert'

import LoginModal from '../../components/Modals/LoginModal'

import { useUser, auth } from '../../auth'
import { getDocumentId } from '../../utils'

import sikkerhetBomLight from '../../assets/images/sikkerhet_bom_light@2x.png'
import duerLight from '../../assets/images/duer@2x.png'
import sauerLight from '../../assets/images/sauer_lag@2x.png'

import ErrorWrapper from '.'

export function LockedTavle(): JSX.Element {
    const user = useUser()
    const userLoggedin = Boolean(user && !user.isAnonymous)
    const history = useHistory()
    const documentId = getDocumentId()
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

              signOut(auth).then(() => history.push(`/t/${documentId}`))
          }
    const callbackMessage = !userLoggedin ? 'Logg inn' : 'Logg ut'

    const loginModal = !userLoggedin ? (
        <LoginModal
            open={displayLogin}
            onDismiss={(): void => setDisplayLogin(false)}
            loginCase="error"
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
            />
        </div>
    )
}

export function PageDoesNotExist(): JSX.Element {
    const history = useHistory()
    const callback = (event: React.SyntheticEvent<HTMLButtonElement>): void => {
        event.preventDefault()
        history.push(`/`)
    }
    return (
        <div>
            <ErrorWrapper
                title="Her var det tomt!"
                message="Det finnes ingen tavle på denne url-en. Du kan lage en avgangstavle ved å trykke på knappen nedenfor."
                image={duerLight}
                callbackMessage="Gå tilbake"
                callback={callback}
            />
        </div>
    )
}

export function NoStopsOnTavle(): JSX.Element {
    return (
        <div>
            <ErrorWrapper
                title="Nå havnet vi på ville veier."
                message="Vi finner ingen stoppesteder å vise på denne tavla. Rediger tavla eller prøv et nytt søk."
                image={sauerLight}
            />
        </div>
    )
}

export function NoTavlerAvailable(): JSX.Element {
    const history = useHistory()
    const callback = (event: React.SyntheticEvent<HTMLButtonElement>): void => {
        event.preventDefault()
        history.push(`/`)
    }
    return (
        <div>
            <ErrorWrapper
                title="Her var det tomt!"
                message="Du har ingen tavler som er lagret på denne kontoen. Trykk på knappen nedenfor for å lage en avgangstavle."
                image={duerLight}
                callbackMessage="Lag en ny tavle"
                callback={callback}
            />
        </div>
    )
}

export function NoSharedTavlerAvailable(): JSX.Element {
    return (
        <div>
            <ErrorWrapper
                title="Her var det tomt!"
                message="Du har ingen tavleforespørsler for øyeblikket. Andre kan dele sine tavler med deg under «Deling»-fanen på innstillingene til tavla."
                image={duerLight}
            />
        </div>
    )
}

export function NoAccessToTavler(): JSX.Element {
    const [displayLogin, setDisplayLogin] = useState<boolean>(false)
    const callback = (event: React.SyntheticEvent<HTMLButtonElement>): void => {
        event.preventDefault()
        setDisplayLogin(true)
    }
    const loginModal = (
        <LoginModal
            open={displayLogin}
            onDismiss={(): void => setDisplayLogin(false)}
            loginCase="error"
        />
    )

    return (
        <div>
            {loginModal}
            <ErrorWrapper
                title="Dine tavler venter!"
                message="Du må logge inn for å se oversikten over tavlene dine. Trykk på knappen nedenfor for å logge inn."
                image={sikkerhetBomLight}
                callbackMessage="Logg inn"
                callback={callback}
            />
        </div>
    )
}
