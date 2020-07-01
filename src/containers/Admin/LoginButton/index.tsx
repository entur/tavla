import React, { useState, useEffect } from 'react';
import firebase from 'firebase';

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Modal } from '@entur/modal';

import { useIsFirebaseInitialized } from '../../../firebase-init'
import { useFirebaseAuthentication } from '../../../auth'

const uiConfig = {
    signInFlow: 'popup',
    autoUpgradeAnonymousUsers: true,
    credentialHelper: 'none',

    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    ],

    callbacks: {
        signInSuccessWithAuthResult: () => false,

        signInFailure: (error: firebaseui.auth.AuthUIError) => {
            if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
                return Promise.resolve()
            }

            return firebase.auth().signInWithCredential(error.credential)
        }
    }
  };

const LoginButton = () => {
    const [modalOpen, setModalOpen] = useState(false)

    const isFirebaseInitialized = useIsFirebaseInitialized()

    const user = useFirebaseAuthentication()

    const isLoggedIn = user && !user.isAnonymous

    useEffect(() => {
        if (isLoggedIn && modalOpen) {
            setModalOpen(false)            
        }
    }, [isLoggedIn])

    if (!isFirebaseInitialized) return null

    if (modalOpen) {
        return (
            <Modal onDismiss={() => setModalOpen(false)} size="small" title="Logg inn  for å fortsette">
                <div>For å låse tavlas redigeringsrettigheter til en konto, må du være innlogget.</div>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
            </Modal>
        )
    }

    return isLoggedIn ? (
        <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
    ) : (
        <a onClick={() => setModalOpen(true)}>Logg inn</a>
    )
}

export default LoginButton