import React, { useState, useEffect } from 'react'
import firebase from 'firebase'

import EmailLogin from './EmailLogin'
import LoginOptions from './LoginOptions'
import Signup from './Signup'
import ResetPassword from './ResetPassword'
import EmailSent from './EmailSent'

import './styles.scss'

import { Modal } from '@entur/modal'

import { useIsFirebaseInitialized } from '../../../firebase-init'
import { useFirebaseAuthentication } from '../../../auth'

export type ModalType =
    | 'LoginOptionsModal'
    | 'LoginEmailModal'
    | 'SignupModal'
    | 'ResetPasswordModal'
    | 'EmailSentModal'

const LoginModal = () => {
    const isFirebaseInitialized = useIsFirebaseInitialized()

    const user = useFirebaseAuthentication()

    const isLoggedIn = user && !user.isAnonymous

    const [modalType, setModalType] = useState<ModalType>('LoginOptionsModal')
    const [modalOpen, setModalOpen] = useState(false)

    const handleDismiss = () => {
        setModalType('LoginOptionsModal')
        setModalOpen(false)
    }

    const displayModal = () => {
        switch (modalType) {
            case 'LoginEmailModal':
                return <EmailLogin setModalType={setModalType} />
            case 'SignupModal':
                return <Signup setModalType={setModalType} />
            case 'ResetPasswordModal':
                return <ResetPassword setModalType={setModalType} />
            case 'EmailSentModal':
                return <EmailSent setModalType={setModalType} />
            default:
                return <LoginOptions setModalType={setModalType} />
        }
    }

    useEffect(() => {
        if (isLoggedIn && modalOpen) {
            handleDismiss()
        }
    }, [isLoggedIn, modalOpen])

    if (!isFirebaseInitialized) return null

    if (modalOpen) {
        return (
            <Modal
                onDismiss={handleDismiss}
                size="small"
                title=""
                className="login-modal"
            >
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
