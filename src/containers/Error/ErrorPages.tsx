import React, { useState } from 'react'

import ErrorWrapper from '.'
import LoginModal from '../Admin/LoginModal'

import sikkerhetBomLight from './../../assets/images/sikkerhet_bom_light.png'

import { useUser } from '../../auth'
import firebase from 'firebase'
import { useToast } from '@entur/alert'
import { getDocumentId } from '../../utils'

export function LockedTavle({ history }: Props): JSX.Element {
    const userLoggedin = !useUser().isAnonymous
    const documentId = getDocumentId()
    const { addToast } = useToast()

    const [displayLogin, setDisplayLogin] = useState<boolean>(false)
    const callback = !userLoggedin
        ? (event: React.FormEvent): void => {
              event.preventDefault()
              setDisplayLogin(true)
          }
        : (): void => {
              addToast({
                  title: 'Logget ut',
                  content: 'Du er nå logget ut av din konto',
                  variant: 'success',
              })
              firebase
                  .auth()
                  .signOut()
                  .then(history.push(`/t/${documentId}`))
          }
    const callbackMessage = !userLoggedin ? 'Logg inn' : 'Logg ut'

    const loginModal = !userLoggedin ? (
        <LoginModal
            open={displayLogin}
            onDismiss={(): void => setDisplayLogin(false)}
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
                history={history}
            />
        </div>
    )
}

interface Props {
    history: any
}
