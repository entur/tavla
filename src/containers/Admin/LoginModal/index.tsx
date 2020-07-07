import React, { useState, useEffect } from 'react'
import firebase from 'firebase'

import EmailLogin from './EmailLogin'
import LoginOptions from './LoginOptions'
import Signup from './Signup'
import ResetPassword from './ResetPassword'
import EmailSent from './EmailSent'

import './styles.scss'

import { Modal } from '@entur/modal'
import { useToast } from '@entur/alert'

import { useFirebaseAuthentication } from '../../../auth'

interface Props {
    open: boolean
    onDismiss: () => void
}

export type ModalType =
    | 'LoginOptionsModal'
    | 'LoginEmailModal'
    | 'SignupModal'
    | 'ResetPasswordModal'
    | 'EmailSentModal'

const LoginModal = ({ open, onDismiss }: Props): JSX.Element => {
    const user = useFirebaseAuthentication()

    const isLoggedIn = user && !user.isAnonymous

    const { addToast } = useToast()

    const [modalType, setModalType] = useState<ModalType>('LoginOptionsModal')

    const displayModal = (): JSX.Element => {
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
        if (isLoggedIn && open) {
            setModalType('LoginOptionsModal')
            addToast({
                title: 'Logget inn',
                content: 'Du har nå logget inn på din konto.',
                variant: 'success',
            })
            onDismiss()
        }
    }, [isLoggedIn, open, onDismiss, addToast])

    const handleDismiss = (): void => {
        setModalType('LoginOptionsModal')
        onDismiss()
    }

    return (
        <Modal
            onDismiss={handleDismiss}
            open={open}
            size="small"
            title=""
            className="login-modal"
        >
            {displayModal()}
        </Modal>
    )
}

export default LoginModal
