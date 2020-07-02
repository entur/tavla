import React, { useState, useEffect } from 'react'
import firebase from 'firebase'

import EmailLogin from './EmailLogin'
import LoginOptions from './LoginOptions'

import { Modal } from '@entur/modal'

import { useIsFirebaseInitialized } from '../../../firebase-init'
import { useFirebaseAuthentication } from '../../../auth'

import sikkerhetBom from '../../../assets/images/sikkerhet_bom.png'
import retinaSikkerhetBom from '../../../assets/images/sikkerhet_bom@2x.png'

type ModalType = 'LoginOptionsModal' | 'LoginEmailModal' | 'SignupModal'

const LoginModal = () => {
    const isFirebaseInitialized = useIsFirebaseInitialized()

    const user = useFirebaseAuthentication()

    const isLoggedIn = user && !user.isAnonymous

    const [modalType, setModalType] = useState<ModalType>('LoginOptionsModal')
    const [modalOpen, setModalOpen] = useState(false)

    const displayModal = () => {
        switch (modalType) {
            case 'LoginEmailModal':
                return <EmailLogin />
            case 'SignupModal':
                return <div>Sign up Modal</div>
            default:
                return <LoginOptions />
        }
    }

    useEffect(() => {
        if (isLoggedIn && modalOpen) {
            setModalOpen(false)
        }
    }, [isLoggedIn, modalOpen])

    if (!isFirebaseInitialized) return null

    if (modalOpen) {
        return (
            <Modal onDismiss={() => setModalOpen(false)} size="small" title="">
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img
                        src={sikkerhetBom}
                        srcSet={`${retinaSikkerhetBom} 2x`}
                        style={{ width: '45%', margin: '0 auto' }}
                    />
                </div>
                {displayModal()}
            </Modal>
        )
    }
    return isLoggedIn ? (
        <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
    ) : (
        <a onClick={() => setModalOpen(true)}>Logg inn</a>
    )
}

export default LoginModal
