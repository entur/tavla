import React, { useState, useEffect } from 'react'
import firebase from 'firebase'

import EmailLogin from './EmailLogin/EmailLogin'
import LoginOptions from './LoginOptions/LoginOptions'
import Signup from './Signup/Signup'
import ResetPassword from './ResetPassword/ResetPassword'

import { Modal } from '@entur/modal'

import { useIsFirebaseInitialized } from '../../../firebase-init'
import { useFirebaseAuthentication } from '../../../auth'

import './styles.scss'

export type ModalType =
    | 'LoginOptionsModal'
    | 'LoginEmailModal'
    | 'SignupModal'
    | 'ResetPasswordModal'

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
