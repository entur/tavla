import React, { useState, useEffect } from 'react'
import firebase from 'firebase/compat/app'

import { useToast } from '@entur/alert'
import { Modal } from '@entur/modal'

import { useFirebaseAuthentication } from '../../auth'
import { usePrevious } from '../../utils'

import EmailLogin from './EmailLogin'
import LoginOptions from './LoginOptions'
import Signup from './Signup'
import ResetPassword from './ResetPassword'
import EmailSent from './EmailSent'

import CloseButton from './CloseButton/CloseButton'
import './styles.scss'

export type LoginCase =
    | 'lock'
    | 'mytables'
    | 'logo'
    | 'link'
    | 'error'
    | 'default'

interface Props {
    open: boolean
    onDismiss: (user?: firebase.User) => void
    loginCase: LoginCase
}

export type ModalType =
    | 'LoginOptionsModal'
    | 'LoginEmailModal'
    | 'SignupModal'
    | 'ResetPasswordModal'
    | 'EmailSentModal'

const LoginModal = ({ open, onDismiss, loginCase }: Props): JSX.Element => {
    const user = useFirebaseAuthentication()

    const isLoggedIn = user && !user.isAnonymous

    const { addToast } = useToast()

    const [modalType, setModalType] = useState<ModalType>('LoginOptionsModal')

    const displayModal = (): JSX.Element => {
        switch (modalType) {
            case 'LoginEmailModal':
                return (
                    <EmailLogin
                        setModalType={setModalType}
                        onDismiss={onDismiss}
                    />
                )
            case 'SignupModal':
                return (
                    <Signup setModalType={setModalType} onDismiss={onDismiss} />
                )
            case 'ResetPasswordModal':
                return (
                    <ResetPassword
                        setModalType={setModalType}
                        onDismiss={onDismiss}
                    />
                )
            case 'EmailSentModal':
                return (
                    <EmailSent
                        setModalType={setModalType}
                        onDismiss={onDismiss}
                    />
                )
            default:
                return (
                    <LoginOptions
                        setModalType={setModalType}
                        loginCase={loginCase}
                    />
                )
        }
    }

    const prevIsLoggedIn = usePrevious(isLoggedIn)

    useEffect(() => {
        if (user && isLoggedIn && !prevIsLoggedIn && open) {
            setModalType('LoginOptionsModal')
            addToast({
                title: 'Logget inn',
                content: 'Du har nå logget inn på din konto.',
                variant: 'success',
            })
            onDismiss(user)
        }
    }, [isLoggedIn, open, onDismiss, addToast, prevIsLoggedIn, user])

    const handleDismiss = (): void => {
        setModalType('LoginOptionsModal')
        onDismiss()
    }

    const closeButton = modalType === 'LoginOptionsModal' && (
        <CloseButton onClick={handleDismiss} />
    )

    return (
        <Modal
            onDismiss={handleDismiss}
            open={open}
            size="small"
            title=""
            className="login-modal"
        >
            {closeButton}
            {displayModal()}
        </Modal>
    )
}

export default LoginModal
